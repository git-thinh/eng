using CefSharp;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Text;
using System.Web;

namespace eng
{
    public class ApiHandler : ISchemeHandler
    {
        public ApiHandler() { }

        public bool ProcessRequestAsync(IRequest request, SchemeHandlerResponse response, OnRequestCompletedHandler requestCompletedCallback)
        {
            string url = request.Url,
                input = request.Body,
                mimeType = "application/json";
            Uri uri = new Uri(url);
            string path = uri.AbsolutePath;
            byte[] bytes;

            switch (path)
            {
                case "/":
                case "/test":
                    bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new { time = DateTime.Now.ToString() }));
                    response.ResponseStream = new MemoryStream(bytes);
                    response.MimeType = mimeType;
                    requestCompletedCallback();
                    return true;
                case "/link/list":
                    //var headers = request.GetHeaders();

                    //bytes = new byte[1024 * 5];
                    //len = stream.Read(bytes, 0, bytes.Length);
                    //input = Encoding.UTF8.GetString(bytes, 0, len);
                    //oLinkRequest lr = JsonConvert.DeserializeObject<oLinkRequest>(input);
                    //oLinkResult rs = _app.f_link_getLinkPaging(lr);
                    //string s = JsonConvert.SerializeObject(rs);
                    //bytes = Encoding.UTF8.GetBytes(s);
                    //stream = new MemoryStream(bytes);

                    return true;
                default:
                    break;
            }

            return false;
        }
    }

    public class ApiHandlerFactory : ISchemeHandlerFactory
    {
        public ApiHandlerFactory() : base() { }

        public ISchemeHandler Create()
        {
            return new ApiHandler();
        }
    }

    public class HttpHandler : ISchemeHandler
    {
        #region

        string _temp_head = string.Empty;
        string _temp_end = string.Empty;

        readonly List<string> DOMAIN_LIST;

        readonly ConcurrentDictionary<string, string> CACHE;
        readonly ConcurrentDictionary<string, string> LINK_TITLE;
        readonly ConcurrentDictionary<int, int> LINK_LEVEL;
        readonly ConcurrentDictionary<string, int> LINK_ID;
        readonly ConcurrentDictionary<int, int> TIME_VIEW_LINK;
        readonly ConcurrentDictionary<string, List<int>> INDEX;
        readonly ConcurrentDictionary<string, List<int>> DOMAIN_LINK;
        readonly ConcurrentDictionary<string, List<int>> KEY_INDEX;
        readonly ConcurrentDictionary<string, string> TRANSLATE;
        
        #endregion

        public HttpHandler()
        {
            if (File.Exists("view/temp-head.html")) _temp_head = File.ReadAllText("view/temp-head.html"); else _temp_head = string.Empty;
            if (File.Exists("view/temp-end.html")) _temp_end = File.ReadAllText("view/temp-end.html"); else _temp_end = string.Empty;

            if (Directory.Exists("cache")) DOMAIN_LIST = Directory.GetDirectories("cache").Select(x => x.Substring(6)).ToList();
            else DOMAIN_LIST = new List<string>();

            ///////////////////////////////////////////////////////////////////////

            TRANSLATE = new ConcurrentDictionary<string, string>();
            CACHE = new ConcurrentDictionary<string, string>();
            LINK_TITLE = new ConcurrentDictionary<string, string>();
            LINK_LEVEL = new ConcurrentDictionary<int, int>();
            LINK_ID = new ConcurrentDictionary<string, int>();
            INDEX = new ConcurrentDictionary<string, List<int>>();
            DOMAIN_LINK = new ConcurrentDictionary<string, List<int>>();
            TIME_VIEW_LINK = new ConcurrentDictionary<int, int>();
            KEY_INDEX = new ConcurrentDictionary<string, List<int>>();
        }
        
        public string f_link_getHtmlCache(string url)
        {
            if (CACHE.ContainsKey(url))
                return CACHE[url];
            return null;
        }

        public string f_link_getHtmlOnline(string url)
        {
            /* https://stackoverflow.com/questions/4291912/process-start-how-to-get-the-output */
            Process process = new Process();
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.FileName = "curl.exe";
            //process.StartInfo.Arguments = url;
            //process.StartInfo.Arguments = "--insecure " + url;
            //process.StartInfo.Arguments = "--max-time 5 -v " + url; /* -v url: handle error 302 found redirect localtion*/
            process.StartInfo.Arguments = "-m 5 -v " + url; /* -v url: handle error 302 found redirect localtion*/
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.StandardOutputEncoding = Encoding.UTF8;
            process.Start();
            //* Read the output (or the error)
            string html = process.StandardOutput.ReadToEnd();
            if (string.IsNullOrEmpty(html))
            {
                string err = process.StandardError.ReadToEnd(), urlDirect = string.Empty;

                int pos = err.IndexOf("< Location: ");
                if (pos != -1)
                {
                    urlDirect = err.Substring(pos + 12, err.Length - (pos + 12)).Split(new char[] { '\r', '\n' })[0].Trim();
                    if (urlDirect[0] == '/')
                    {
                        Uri uri = new Uri(url);
                        urlDirect = uri.Scheme + "://" + uri.Host + urlDirect;
                    }

                    Console.WriteLine("-> Redirect: " + urlDirect);


                    html = f_link_getHtmlCache(urlDirect);
                    if (string.IsNullOrEmpty(html))
                    {
                        return "<script> location.href='" + urlDirect + "'; </script>";
                    }
                    else
                        return html;
                }
                else
                {
                    Console.WriteLine(" ??????????????????????????????????????????? ERROR: " + url);
                }

                Console.WriteLine(" -> Fail: " + url);

                return null;
            }

            Console.WriteLine(" -> Ok: " + url);

            string title = Html.f_html_getTitle(html);
            html = _htmlFormat(url, html);
            f_cacheUrl(url);
            CACHE.TryAdd(url, html);

            //string err = process.StandardError.ReadToEnd();
            process.WaitForExit();

            ////if (_fomMain != null) _fomMain.f_browser_updateInfoPage(url, title);

            return html;

            //////* Create your Process
            ////Process process = new Process();
            ////process.StartInfo.FileName = "curl.exe";
            ////process.StartInfo.Arguments = url;
            ////process.StartInfo.UseShellExecute = false;
            ////process.StartInfo.RedirectStandardOutput = true;
            ////process.StartInfo.RedirectStandardError = true;
            ////process.StartInfo.StandardOutputEncoding = Encoding.UTF8;
            //////* Set your output and error (asynchronous) handlers
            ////process.OutputDataReceived += (se, ev) => {
            ////    string html = ev.Data;

            ////    _link.TryAdd(url, _link.Count + 1);
            ////    _html.TryAdd(url, html);
            ////};
            //////process.ErrorDataReceived += new DataReceivedEventHandler(OutputHandler);
            //////* Start process and handlers
            ////process.Start();
            ////process.BeginOutputReadLine();
            ////process.BeginErrorReadLine();
            ////process.WaitForExit(); 
        }

        string _htmlFormat(string url, string html)
        {
            string s = HttpUtility.HtmlDecode(html), title = "";

            // Fetch all url same domain in this page ...
            //string[] urls = Html.f_html_actractUrl(url, s);
            s = Html.f_html_Format(url, s);

            int posH1 = s.ToLower().IndexOf("<h1");
            if (posH1 != -1) s = s.Substring(posH1, s.Length - posH1);

            s = "<!--" + url + @"-->" + Environment.NewLine + @"<input id=""___title"" value=""" + title + @""" type=""hidden"">" + s;

            return s;
        }

        string f_text_convert_UTF8_ACSII(string utf8)
        {
            string stFormD = utf8.Normalize(NormalizationForm.FormD);
            StringBuilder sb = new StringBuilder();
            for (int ich = 0; ich < stFormD.Length; ich++)
            {
                System.Globalization.UnicodeCategory uc = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(stFormD[ich]);
                if (uc != System.Globalization.UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(stFormD[ich]);
                }
            }
            sb = sb.Replace('Đ', 'D');
            sb = sb.Replace('đ', 'd');
            return (sb.ToString().Normalize(NormalizationForm.FormD));
        }

        void f_cacheUrl(string url, string title = "", string domain = "", int indexForEach = 0)
        {
            if (string.IsNullOrEmpty(url) || string.IsNullOrEmpty(title)) return;

            if (domain == "") domain = Html.f_html_getDomainMainByUrl(url);
            int id = LINK_TITLE.Count + 1, time_view = int.Parse(DateTime.Now.ToString("1ddHHmmss")) + indexForEach;

            if (!LINK_TITLE.ContainsKey(url))
            {
                LINK_TITLE.TryAdd(url, title);
                LINK_ID.TryAdd(url, id);
                TIME_VIEW_LINK.TryAdd(id, time_view);
                LINK_LEVEL.TryAdd(id, url.Split('/').Length - 3);
            }

            lock (DOMAIN_LIST) if (!DOMAIN_LIST.Contains(domain)) DOMAIN_LIST.Add(domain);
            if (DOMAIN_LINK.ContainsKey(domain)) DOMAIN_LINK[domain].Add(id); else DOMAIN_LINK.TryAdd(domain, new List<int>() { id });

            if (!string.IsNullOrEmpty(title))
            {
                string s = f_text_convert_UTF8_ACSII(title).ToLower().ToLower();
                string[] words = s.Split(' ').Where(x => x.Length > 2).ToArray();
                for (int i = 0; i < words.Length; i++)
                {
                    if (KEY_INDEX.ContainsKey(words[i]))
                    {
                        if (KEY_INDEX[words[i]].IndexOf(id) == -1)
                            KEY_INDEX[words[i]].Add(id);
                    }
                    else
                        KEY_INDEX.TryAdd(words[i], new List<int>() { id });
                }
                //Console.WriteLine(string.Format(" INDEX: {0}", KEY_INDEX.Count));
            }
        }

        public bool ProcessRequestAsync(IRequest request, SchemeHandlerResponse response, OnRequestCompletedHandler requestCompletedCallback)
        {
            if (request.Method != "GET") return false;
            string url = request.Url, mimeType = "text/html", text, accept = string.Empty;

            #region [ VIEW ]

            if (url.Contains("/view/")) {
                Uri uri = new Uri(url);
                string path = uri.AbsolutePath.Substring(1).Replace('/', '\\');
                if (File.Exists(path))
                {
                    string ext = path.Substring(path.Length - 3, 3);
                    switch (ext)
                    {
                        case "tml":
                            mimeType = "text/html";
                            break;
                        case ".js":
                            mimeType = "text/javascript";
                            break;
                        case "css":
                            mimeType = "text/css";
                            break;
                    }

                    text = File.ReadAllText(path);

                    //string body = File.ReadAllText(path);
                    //int posH1 = body.ToLower().IndexOf("<h1");
                    //if (posH1 != -1) body = body.Substring(posH1, body.Length - posH1);
                    //string temp = File.ReadAllText("view/view.html");
                    //string htm = temp + body + "</body></html>";

                    byte[] buf = Encoding.UTF8.GetBytes(text);
                    response.ResponseStream = new MemoryStream(buf);
                    response.MimeType = mimeType;
                    requestCompletedCallback();

                    return true;
                }
            }

            #endregion

            var headers = request.GetHeaders();
            if (headers.ContainsKey("Accept")) accept = headers["Accept"];

            if (accept.Length == 0 || accept.Contains("text/html") == false) return false;

            //if (headers.ContainsKey("Referer")) return false;

            text = f_link_getHtmlOnline(url);
            if (text == null) text = ""; else
            {
                if (File.Exists("view/temp-head.html")) _temp_head = File.ReadAllText("view/temp-head.html"); 
                if (File.Exists("view/temp-end.html")) _temp_end = File.ReadAllText("view/temp-end.html");
                text = _temp_head + "\r\n</head>\r\n<body>\r\n" + text + _temp_end;
            }

            byte[] bytes = Encoding.UTF8.GetBytes(text);
            response.ResponseStream = new MemoryStream(bytes);
            response.MimeType = mimeType;
            requestCompletedCallback();
            return true;
        }
    }

    public class MyWebClient : WebClient
    {
        protected override WebRequest GetWebRequest(Uri address)
        {
            HttpWebRequest request = base.GetWebRequest(address) as HttpWebRequest;
            request.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;
            return request;
        }
    }

    public class HttpHandlerFactory : ISchemeHandlerFactory
    {
        public HttpHandlerFactory() : base() { }

        public ISchemeHandler Create()
        {
            return new HttpHandler();
        }
    }

    public class LocalSchemeHandler : ISchemeHandler
    {
        public bool ProcessRequestAsync(IRequest request, SchemeHandlerResponse response, OnRequestCompletedHandler requestCompletedCallback)
        {
            byte[] bytes;
            string url = request.Url, mimeType = "text/html";
            Uri uri = new Uri(url);
            string path = uri.AbsolutePath.Replace('/', '\\').Substring(1).ToLower(),
                ext = path.Substring(path.Length - 3, 3);
            switch (ext)
            {
                case "htm":
                case "tml":
                    #region
                    if (File.Exists(path))
                    {
                        mimeType = "text/html";
                        bytes = File.ReadAllBytes(path);
                        response.ResponseStream = new MemoryStream(bytes);
                        response.MimeType = mimeType;
                        requestCompletedCallback();
                        return true;
                    }
                    #endregion
                    break;
                case ".js":
                    #region
                    if (File.Exists(path))
                    {
                        mimeType = "text/javascript";
                        bytes = File.ReadAllBytes(path);
                        response.ResponseStream = new MemoryStream(bytes);
                        response.MimeType = mimeType;
                        requestCompletedCallback();
                        return true;
                    }
                    #endregion
                    break;
                case "css":
                    #region
                    if (File.Exists(path))
                    {
                        mimeType = "text/css";
                        bytes = File.ReadAllBytes(path);
                        response.ResponseStream = new MemoryStream(bytes);
                        response.MimeType = mimeType;
                        requestCompletedCallback();
                        return true;
                    }
                    #endregion
                    break;
            }

            mimeType = "text/html";
            bytes = Encoding.UTF8.GetBytes(DateTime.Now.ToString());
            response.ResponseStream = new MemoryStream(bytes);
            response.MimeType = mimeType;
            requestCompletedCallback();
            return true;
        }
    }

    public class LocalSchemeHandlerFactory : ISchemeHandlerFactory
    {
        public ISchemeHandler Create()
        {
            return new LocalSchemeHandler();
        }
    }

    public class BrowserMenuContextHandler : IMenuHandler
    {
        public bool OnBeforeMenu(IWebBrowser browser)
        {
            return true;
        }
    }
}
