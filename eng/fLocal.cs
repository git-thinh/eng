using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.Windows.Forms; 

namespace eng
{
    public class fLocal: Form 
    { 
        readonly WebView ui_browser; 
        readonly string URL = "about:blank";

        public fLocal( )
        {
            //URL = "res://local/view/ajax_api.html";
            URL = "https://dictionary.cambridge.org/grammar/british-grammar/";

            ui_browser = new WebView("about:blank",new CefSharp.BrowserSettings() {
                WebSecurityDisabled = true,
            }) { Dock = DockStyle.Fill };
            this.Controls.Add(ui_browser);
            ui_browser.PropertyChanged += (se, ev) => { switch (ev.PropertyName) { case "IsBrowserInitialized": f_browser_Go(URL); break; case "Title": f_browser_loadTitleReady(ui_browser.Title); break; case "IsLoading": f_browser_loadDomReady(); break; } };
            //ui_browser.RequestHandler = new BrowserRequestHandler(app, this);
            //ui_browser.RegisterJsObject("API", new API(app, this));


            ContextMenu cm = new ContextMenu(f_build_contextMenu());
            ui_browser.ContextMenu = cm;
            ui_browser.MenuHandler = new BrowserMenuContextHandler();

            this.FormClosing += (se, ev) => {

            };
        }

        private void f_browser_loadDomReady()
        {
        }

        private MenuItem[] f_build_contextMenu()
        {
            return new MenuItem[] {
                new MenuItem("Reload Page", f_browser_menuContextItemClick) { Tag = "reload" },
                new MenuItem("Show DevTool", f_browser_menuContextItemClick){ Tag = "devtool_open" },
                new MenuItem("View Source", f_browser_menuContextItemClick){ Tag = "view_source" },
                new MenuItem("-"){ Tag = "" },
                new MenuItem("Exit Application", f_browser_menuContextItemClick){ Tag = "exit" },
            };
        }

        private void f_browser_menuContextItemClick(object sender, EventArgs e)
        {
            MenuItem menu = (MenuItem)sender;
            string key = menu.Tag as string;
            switch (key)
            {
                case "reload":
                    if (ui_browser.IsLoading) ui_browser.Stop();
                    ui_browser.Reload();
                    break;
                case "devtool_open":
                    ui_browser.ShowDevTools();
                    break;
                case "view_source":
                    #region
                   
                    #endregion
                    break;
                case "exit":
                    this.Close();
                    break;
            }
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
        
    }
}
