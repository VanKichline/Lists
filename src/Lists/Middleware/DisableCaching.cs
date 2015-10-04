// Set _rejectStrings to regular expressions representing files or directories to which NoCache headers are NOT applied
// Set _accpetStrings to regular expressions representing files or directories to which NoCache headers ARE applied

using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Lists.Middleware {
    public class DisableCaching {
        public string[] _rejectStrings = { @"^/lib/.*" };
        public string[] _acceptStrings = { @".*\.js$", @".*\.css$", @".*\.html$" };

        private RequestDelegate _next;
        private Regex[] _rejectPatterns;
        private Regex[] _acceptPatterns;

        public DisableCaching(RequestDelegate next) {
            _next = next;
            InitPatterns(_rejectStrings, out _rejectPatterns);
            InitPatterns(_acceptStrings, out _acceptPatterns);
        }

        public async Task Invoke(HttpContext httpContext) {
            string filePath = httpContext.Request.Path.ToString();  // The file path being requested
            if ((!AnyMatch(filePath, _rejectPatterns)) && AnyMatch(filePath, _acceptPatterns)) {
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
