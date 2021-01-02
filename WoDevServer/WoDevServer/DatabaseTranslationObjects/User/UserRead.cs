﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WoDevServer.DatabaseTranslationObjects.User
{
    public class UserRead
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Login { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
    }
}