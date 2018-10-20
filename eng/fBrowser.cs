using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eng
{
    public class fBrowser : Form, IBrowser
    {
        readonly WebView ui_browser;
        readonly string URL = "about:blank";

        public fBrowser()
        {
            this.Width = 800;
            this.Height = Screen.PrimaryScreen.WorkingArea.Height;

            //URL = "res://local/view/ajax_api.html";
            URL = "https://dictionary.cambridge.org/grammar/british-grammar/";

            ui_browser = new WebView("about:blank", new CefSharp.BrowserSettings()
            {
                WebSecurityDisabled = true,
                PageCacheDisabled = true
            })
            { Dock = DockStyle.Fill };
            this.Controls.Add(ui_browser);
            ui_browser.PropertyChanged += (se, ev) => { switch (ev.PropertyName) { case "IsBrowserInitialized": f_browser_Go(URL); f_browser_DevTool(); break; case "Title": f_browser_loadTitleReady(ui_browser.Title); break; case "IsLoading": f_browser_loadDomReady(); break; } };
            ui_browser.MenuHandler = new BrowserMenuContextHandler();

            this.Shown += (se, ev) =>
            {
                this.Top = 0;
                this.Left = 0;
            };

            this.FormClosing += (se, ev) =>
            {
            };
        }

        private void f_browser_loadDomReady()
        {
        }
        
        private void f_browser_loadTitleReady(string title)
        {
        }

        public void f_sendToBrowser(string data)
        {
            string js = "f_receiveMessageFromAPI(" + data + ");";
            ui_browser.ExecuteScript(js);
            //var val = ui_browser.EvaluateScript(js);
        }

        public void f_browser_Go(string url)
        {
            if (ui_browser.IsLoading) ui_browser.Stop();
            ui_browser.Load(url);
        }

        public void f_browser_DevTool()
        {
            ui_browser.ShowDevTools();
        }

        public void f_browser_Reload()
        {
            ui_browser.Reload();
        }

    }
}
