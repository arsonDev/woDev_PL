﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WoDevServer.Database.Model;

namespace WoDevServer.Database.Repository
{
    public interface IUserProfileTypeRepository
    {
        List<UserProfileType> GetAllTypes();
    }
}
