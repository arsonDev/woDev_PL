﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WoDevServer.DatabaseTranslationObjects.Profile
{
    public class ProfileRead
    {
        [Required]
        public int UserProfileId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Address { get; set; }

        public string Phone { get; set; }
        public byte[] File { get; set; }
        public byte[] Logo { get; set; }
        public DateTime? BirthDate { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string SurName { get; set; }

        [Required]
        public int Type { get; set; }
    }
}