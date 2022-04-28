using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DeviceDetectorNET;
using DeviceDetectorNET.Cache;
using DeviceDetectorNET.Parser;
using DeviceDetectorNET.Results;
using DeviceDetectorNET.Results.Client;

namespace SC_Pet_Claim.Models
{
    public class BrowserDetectionModel
    {
        public bool BrowserError { get; set; }
        public bool OSError { get; set; }
        public bool ShowApp { get; set; }
        public bool ShowBrowserDetails { get; set; }
        public bool IsMobile { get; set; }
        public string BrowserName { get; set; }
        public string BrowserVersion { get; set; }
        public string Platform { get; set; }
        public string ErrorBlock { get; set; }
        public string BrowserMessage { get; set; }
        public string OSMessage { get; set; }
        public string ErrorMessage { get; set; }
        public System.Exception Exception { get; set; }
        public string PlatformVersion { get; set; }
        public Single PlatformMajorVersion { get; set; }
        public Single PlatformMinorVersion { get; set; }
        public DeviceDetector Detector { get; set; }
        public ParseResult<OsMatchResult> OperationSystem { get; set; }
        public ParseResult<BrowserMatchResult> BrowserClient { get; set; }
        public string DeviceName { get; set; }
        public string BrandName { get; set; }
        public string DeviceModel { get; set; }
        public string UserAgent { get; set; }
        public bool IOS_13_2_3 { get; set; }

        public BrowserDetectionModel(string userAgent)
        {
            try
            {
                this.UserAgent = userAgent;

                InitialiseDetector();

                this.BrowserError = false;
                this.ShowApp = true;
                this.ShowBrowserDetails = false;

                if (this.UserAgent.Contains("iPhone OS 13_2_3") || this.UserAgent.Contains("CPU OS 13_2_3"))
                {
                    this.IOS_13_2_3 = true;
                }

                if (!this.Detector.IsBot())
                {
                    this.OperationSystem = this.Detector.GetOs();
                    this.DeviceName = this.Detector.GetDeviceName();
                    this.BrandName = this.Detector.GetBrandName();
                    this.DeviceModel = this.Detector.GetModel();
                    this.BrowserClient = this.Detector.GetBrowserClient();
                    this.BrowserName = this.BrowserClient.Match.Name;
                    this.BrowserVersion = this.floatFormat(this.BrowserClient.Match.Version);
                    this.Platform = this.OperationSystem.Match.Name;
                    this.PlatformVersion = this.floatFormat(this.OperationSystem.Match.Version);
                    this.IsMobile = this.DeviceName != "desktop";
                    this.BrowserError = false;
                    this.PlatformMajorVersion = 0;
                    this.PlatformMinorVersion = 0;

                    this.SetMajorMinor();

                    BrowserCheck();
                }
            }
            catch (Exception ex)
            {
                this.Exception = ex;
                this.BrowserName = "Uknown";
                // this.BrowserVersion = "Uknown";
                this.Platform = "Uknown";
                // this.PlatformVersion = this.Platform = "Uknown";
                this.IsMobile = this.DeviceName != "desktop";
                this.BrowserError = true;
                this.ErrorMessage = "First catch: " + ex.Message + "<br>" + ex.Source + "<br>" + ex.StackTrace;
            }

            if (this.BrowserError || this.OSError)
            {
                this.ShowApp = false;
            }
        }

        private void BrowserCheck()
        {
            switch (BrowserName)
            {
                case "Internet Explorer":
                    if (PlatformVersion == "8")
                    {
                        BrowserError = float.Parse(BrowserVersion) < 11;
                        ErrorBlock = "use-chrome-firefox";
                        BrowserMessage = "browser-switch";
                    }
                    else
                    {
                        BrowserError = float.Parse(BrowserVersion) < 11;
                        ErrorBlock = "explorer";
                    }

                    break;
                case "Chrome":
                    BrowserError = float.Parse(BrowserVersion) < 50;
                    break;
                case "Chrome Mobile":
                    BrowserError = float.Parse(BrowserVersion) < 30;
                    break;
                case "Mobile Safari":
                    BrowserError = float.Parse(BrowserVersion) < 10.0;
                    break;
                case "Samsung Browser":
                    BrowserError = float.Parse(BrowserVersion) < 7.4;
                    break;
                case "Firefox":
                    BrowserError = float.Parse(BrowserVersion) < 65;
                    ErrorBlock = "firefox";
                    break;
                case "Microsoft Edge":
                    BrowserError = float.Parse(BrowserVersion) < 17;
                    break;
                case "Safari":
                    BrowserError = float.Parse(BrowserVersion) < 9;
                    break;
            }

            switch (Platform.ToLower())
            {
                case "windows":
                    switch (PlatformVersion)
                    {
                        case "Vista":
                        case "XP":
                        case "Server 2003":
                            OSError = true;
                            OSMessage = "no-support";
                            ErrorBlock = "no-support";
                            BrowserMessage = "no-support";
                            break;
                    }

                    switch (BrowserName)
                    {
                        case "Safari":
                        case "Opera":
                            BrowserError = true;
                            ErrorBlock = "use-chrome-firefox";
                            BrowserMessage = "browser-switch";
                            break;

                    }

                    break;
                case "mac":
                    OSMessage = "update-osx";
                    OSError = PlatformMinorVersion <= 8;
                    if (OSError)
                    {
                        OSMessage = "no-support";
                        ErrorBlock = "no-support";
                        BrowserMessage = "no-support";
                    }
                    if (PlatformVersion == "10.9")
                    {
                        OSMessage = "limit-support";
                        switch (BrowserName)
                        {
                            case "Safari":
                            case "Chrome":
                            case "Opera":
                            case "Yandex Browser":
                                BrowserError = true;
                                ErrorBlock = "use-firefox";
                                BrowserMessage = "browser-switch";
                                break;
                            case "Firefox":
                                BrowserMessage = "update-latest";
                                break;
                        }
                    }
                    else if (PlatformVersion == "10.10")
                    {
                        OSMessage = "limit-support";
                        switch (BrowserName)
                        {
                            case "Safari":
                            case "Opera":
                            case "Yandex Browser":
                                BrowserError = true;
                                ErrorBlock = "use-chrome-firefox";
                                BrowserMessage = "browser-switch";
                                break;
                            case "Firefox":
                            case "Chrome":
                                BrowserMessage = "update-latest";
                                break;
                        }
                    }
                    if (PlatformMinorVersion >= 11 && PlatformMinorVersion <= 12)
                    {
                        OSMessage = "";
                        switch (BrowserName)
                        {
                            case "Safari":
                            case "Opera":
                            case "Yandex Browser":
                                BrowserError = true;
                                ErrorBlock = "use-chrome-firefox";
                                BrowserMessage = "browser-switch";
                                break;
                            case "Firefox":
                            case "Chrome":
                                BrowserMessage = "update-latest";
                                break;
                        }
                    }
                    if (PlatformMinorVersion >= 13)
                    {
                        OSMessage = "";
                        switch (BrowserName)
                        {

                            case "Opera":
                                BrowserError = true;
                                ErrorBlock = "use-chrome-firefox-safari";
                                BrowserMessage = "browser-switch";
                                break;
                            case "Firefox":
                            case "Safari":
                            case "Chrome":
                                BrowserMessage = "update-latest";
                                break;
                        }
                    }
                    break;
            }
        }

        private void InitialiseDetector()
        {
            this.Detector = new DeviceDetector(this.UserAgent);
            this.Detector.SetCache(new DictionaryCache());
            this.Detector.DiscardBotInformation();
            this.Detector.SkipBotDetection();
            this.Detector.Parse();
        }

        private void SetMajorMinor()
        {
            try
            {
                var a = this.PlatformVersion.Split('.');
                this.PlatformMajorVersion = Int16.Parse((string)a.GetValue(0));
                this.PlatformMinorVersion = a.Count() >= 2 ? Int16.Parse((string)a.GetValue(1)) : 0;
            }
            catch (Exception ex)
            {

                this.ErrorMessage = "SetMajorMinor: " + ex.Message + "<br>" + ex.Source + "<br>" + ex.StackTrace;
            }
        }
        private string floatFormat(string value)
        {
            var a = value.Split('.');
            return a.Count() >= 2 ? (string)a.GetValue(0) + "." + (string)a.GetValue(1) : (string)a.GetValue(0);
        }
    }
}