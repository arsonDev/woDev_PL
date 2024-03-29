﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WoDevServer.Services
{
    public interface ITokenManager
    {
        bool IsCurrentActiveToken();
        bool DeactiveCurrentAsync();
        bool Deactivate(string token);

        void ActivateToken(string token);
        void IncreaseValid();
    }
}
