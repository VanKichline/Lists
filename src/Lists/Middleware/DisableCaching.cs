﻿// Set _rejectStrings to regular expressions representing files or directories to which NoCache headers are NOT applies
// Set _accpetStrings to regular expressions representing files or directories to which NoCache headers ARE applies

using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Lists.Middleware {
    public class DisableCaching {
        public string[] _rejectStrings = { @"^/lib/.*" };
        public string[] _acceptStrings = { @".*\.js$", @".*\.css$", @".*\.html$" };
        public bool _rejectBeforeAccept = true;

        private RequestDelegate _next;
        private Regex[] _rejectPatterns;
        private Regex[] _acceptPatterns;

        public DisableCaching(RequestDelegate next) {
            _next = next;
            InitPatterns(_rejectStrings, out _rejectPatterns);
            InitPatterns(_acceptStrings, out _acceptPatterns);
        }

        public async Task Invoke(HttpContext httpContext) {
            // File being served is httpContext.Request.Path
            bool process = false;
            string filePath = httpContext.Request.Path.ToString();
            if(_rejectBeforeAccept) {
                process = !AnyMatch(filePath, _rejectPatterns);
                if(process) {
                    process = AnyMatch(filePath, _acceptPatterns);
                }
            }
            else {
                process = AnyMatch(filePath, _acceptPatterns);
                if(process) {
                    process = !AnyMatch(filePath, _rejectPatterns);
                }
            }
            if (process) {
                // Ensure that this file will be reloaded by the browser
                httpContext.Response.Headers.Add("Cache-Control", new string[] { "no-cache" });
            }
            await _next.Invoke(httpContext);
        }

        private void InitPatterns(string[] strings, out Regex[] patterns) {
            patterns = new Regex[strings.Length];
            for(int i = 0; i < strings.Length; i++) {
                patterns[i] = new Regex(strings[i]);
            }
        }

        private bool AnyMatch(string str, Regex[] patterns) {
            foreach(Regex pattern in patterns) {
                Match match = pattern.Match(str);
                if (match.Success)
                    return true;
            }
            return false;
        }
    }
}
