using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DeviceDetectorNET;
using DeviceDetectorNET.Cache;
using DeviceDetectorNET.Parser;
using DeviceDetectorNET.Results;
using DeviceDetectorNET.Results.Client;

namespace PetInsurance_Site.Models
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
                // this.UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15";
                // DeviceDetector.SetVersionTruncation(VersionTruncation.VERSION_TRUNCATION_MAJOR);
                this.Detector = new DeviceDetector(this.UserAgent);
                this.Detector.SetCache(new DictionaryCache());
                this.Detector.DiscardBotInformation();
                this.Detector.SkipBotDetection();
                this.Detector.Parse();
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



                    if (this.BrowserName == "Internet Explorer")
                    {
                        this.BrowserError = true;
                        this.ErrorBlock = "use-chrome-firefox";
                        this.BrowserMessage = "browser-switch";

                    }
                    if (this.BrowserName == "Chrome")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 50;
                    }
                    if (this.BrowserName == "Chrome Mobile")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 30;
                    }
                    if (this.BrowserName == "Mobile Safari")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 10.0;
                    }
                    if (this.BrowserName == "Samsung Browser")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 7.4;
                    }
                    if (this.BrowserName == "Firefox")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 65;
                        this.ErrorBlock = "firefox";
                    }
                    if (this.BrowserName == "Microsoft Edge")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 17;
                    }
                    if (this.BrowserName == "Safari")
                    {
                        this.BrowserError = Single.Parse(this.BrowserVersion) < 9;
                    }
                    if (this.Platform.ToLower() == "windows")
                    {
                        switch (this.PlatformVersion)
                        {
                            case "Vista":
                            case "XP":
                            case "Server 2003":
                                this.OSError = true;
                                this.OSMessage = "no-support";
                                this.ErrorBlock = "no-support";
                                this.BrowserMessage = "no-support";
                                break;
                        }
                       
                       switch(this.BrowserName){
                            case "Safari":
                            case "Opera":
                               this.BrowserError = true;
                               this.ErrorBlock = "use-chrome-firefox";
                               this.BrowserMessage = "browser-switch";
                               break;
                       
                       }
                
                    }
                    if (this.Platform.ToLower() == "mac")
                    {
                        this.OSMessage = "update-osx";
                        this.OSError = this.PlatformMinorVersion <= 8;
                        if (this.OSError)
                        {
                            this.OSMessage = "no-support";
                            this.ErrorBlock = "no-support";
                            this.BrowserMessage = "no-support";
                        }
                        if(this.PlatformVersion == "10.9")
                        {
                            this.OSMessage = "limit-support";
                            switch (this.BrowserName)
                            {
                                case "Safari":
                                case "Chrome":
                                case "Opera":
                                case "Yandex Browser":
                                    this.BrowserError = true;
                                    this.ErrorBlock = "use-firefox";
                                    this.BrowserMessage = "browser-switch";
                                    break;
                                case "Firefox":
                                    this.BrowserMessage = "update-latest";
                                    break;
                            }
                        }
                        if (this.PlatformVersion == "10.10")
                        {
                            this.OSMessage = "limit-support";
                            switch (this.BrowserName)
                            {
                                case "Safari":
                                case "Opera":
                                case "Yandex Browser":
                                    this.BrowserError = true;
                                    this.ErrorBlock = "use-chrome-firefox";
                                    this.BrowserMessage = "browser-switch";
                                    break;
                                case "Firefox":
                                case "Chrome":
                                    this.BrowserMessage = "update-latest";
                                    break;
                            }
                        }
                        if (this.PlatformMinorVersion >= 11 && this.PlatformMinorVersion <= 12)
                        {
                            this.OSMessage = "";
                            switch (this.BrowserName)
                            {
                                case "Safari":
                                case "Opera":
                                case "Yandex Browser":
                                    this.BrowserError = true;
                                    this.ErrorBlock = "use-chrome-firefox";
                                    this.BrowserMessage = "browser-switch";
                                    break;
                                case "Firefox":
                                case "Chrome":
                                    this.BrowserMessage = "update-latest";
                                    break;
                            }
                        }
                        if (this.PlatformMinorVersion >= 13)
                        {
                            this.OSMessage = "";
                            switch (this.BrowserName)
                            {
                               
                                case "Opera":
                                    this.BrowserError = true;
                                    this.ErrorBlock = "use-chrome-firefox-safari";
                                    this.BrowserMessage = "browser-switch";
                                    break;
                                case "Firefox":
                                case "Safari":
                                case "Chrome":
                                    this.BrowserMessage = "update-latest";
                                    break;
                            }
                        }
                    }
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