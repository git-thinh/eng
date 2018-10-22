using CefSharp;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Windows.Forms;

namespace eng
{
    public interface ICache
    {
        void f_translate_AddIfNotExist(string text, string mean);
        string f_translate_GetIfExist(string text, string _default = "");
        string f_translate_GetAllJson();
        void f_translate_Clear();
    }

    class Cache : ICache
    {
        static ConcurrentDictionary<string, string> _TRANSLATE = new ConcurrentDictionary<string, string>();

        public void f_translate_AddIfNotExist(string text, string mean)
        {
            if (!_TRANSLATE.ContainsKey(text)) _TRANSLATE.TryAdd(text, mean);
        }

        public string f_translate_GetIfExist(string text, string _default = "")
        {
            if (_TRANSLATE.ContainsKey(text)) return _TRANSLATE[text];
            return _default;
        }
        public string f_translate_GetAllJson() { return JsonConvert.SerializeObject(_TRANSLATE); }

        public void f_translate_Clear()
        {
            _TRANSLATE.Clear();
        }
    }

    class App
    {

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            ThreadPool.SetMaxThreads(25, 25);
            ServicePointManager.DefaultConnectionLimit = 1000;

            ///* Certificate validation callback */
            //ServicePointManager.ServerCertificateValidationCallback += (object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors error) =>
            //{
            //    /* If the certificate is a valid, signed certificate, return true. */
            //    if (error == System.Net.Security.SslPolicyErrors.None) return true;
            //    //Console.WriteLine("X509Certificate [{0}] Policy Error: '{1}'", cert.Subject, error.ToString());
            //    return false;
            //};
            ////ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            //ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2

            //////////////////////////////////////////////////////////////////////////////////

            Settings settings = new Settings();
            
            if (!CEF.Initialize(settings)) return;

            Cache cache = new Cache();

            //CEF.RegisterScheme("res", "local", new LocalSchemeHandlerFactory());
            CEF.RegisterScheme("http", "api", new ApiHandlerFactory(cache));
            CEF.RegisterScheme("https", "api", new ApiHandlerFactory(cache));
            CEF.RegisterScheme("http", new HttpHandlerFactory());
            CEF.RegisterScheme("https", new HttpHandlerFactory());
            fBrowser f = new fBrowser();
            CEF.RegisterJsObject("API", new ApiJavascript(f));

            //Application.EnableVisualStyles();
            //Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(f);

            cache.f_translate_Clear();

            CEF.Shutdown();
        }
    }
}
