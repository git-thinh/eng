using CefSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Windows.Forms;

namespace eng
{
    static class App
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
            CEF.RegisterScheme("res", "api", new ApiHandlerFactory());
            CEF.RegisterScheme("res", "local", new LocalSchemeHandlerFactory());
            CEF.RegisterScheme("http", new HttpHandlerFactory());
            CEF.RegisterScheme("https", new HttpHandlerFactory());
            
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new fBrowser());

            CEF.Shutdown();
        }
    }
}
