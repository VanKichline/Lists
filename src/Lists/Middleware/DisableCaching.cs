﻿using Microsoft.AspNet.Builder;
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
            string[] values = { "no-cache" };
            httpContext.Response.Headers.Add("Cache-Control", values);
            await _next.Invoke(httpContext);
        }
    }
}
