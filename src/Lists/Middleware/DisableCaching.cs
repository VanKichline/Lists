using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using System.Threading.Tasks;

namespace Lists.Middleware {
    public class DisableCaching {
        private RequestDelegate _next;

        public DisableCaching(RequestDelegate next) {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext) {
            // File being served is httpContext.Request.Path
            string path = httpContext.Request.Path.ToString();
            // Let library files remained cached
            if (!path.StartsWith("/lib/", System.StringComparison.CurrentCultureIgnoreCase)) {
                // Make sure this file will be reloaded by the browser
                httpContext.Response.Headers.Add("Cache-Control", new string[] { "no-cache" });
            }
            await _next.Invoke(httpContext);
        }
    }
}
