﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WoDevServer.Models;

namespace WoDevServer.Services
{
    public class TokenManager : ITokenManager
    {
        private readonly IMemoryCache _cache;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IOptions<JwtOptions> _jwtOptions;

        public TokenManager(IMemoryCache cache, IHttpContextAccessor httpContextAccessor, IOptions<JwtOptions> jwtOptions)
        {
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _jwtOptions = jwtOptions;
        }

        public bool Deactivate(string token)
        {
            try
            {
                _cache.Remove(token);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public bool DeactiveCurrentAsync() => Deactivate(GetCurrentAsync());

        private bool IsActiveAsync(string token) => _cache.Get(token) != null;

        public bool IsCurrentActiveToken() => IsActiveAsync(GetCurrentAsync());

        public void ActivateToken(string token)
        {
            _cache.Set(token, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_jwtOptions.Value.ExpiryMinutes)
            });
        }

        private string GetCurrentAsync()
        {
            var authHeader = _httpContextAccessor.HttpContext.Request.Headers["authorization"];
            return authHeader == Microsoft.Extensions.Primitives.StringValues.Empty ? string.Empty : authHeader.Single().Split(" ").Last();
        }

        public void IncreaseValid()
        {
            if (IsCurrentActiveToken())
                ActivateToken(GetCurrentAsync());
        }
    }
}
