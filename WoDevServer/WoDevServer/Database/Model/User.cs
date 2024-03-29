﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WoDevServer.Database.Model
{
    [Table("User")]
    public class User
    {
        [Key]
        [Column("Id")]
        public int UserId { get; set; }

        [Required]
        [Column("Email")]
        public string Email { get; set; }

        [Column("Login")]
        public string Login { get; set; }

        [Required]
        [Column("Password")]
        public byte[] Password { get; set; }

        [Required]
        [Column("PasswordSalt")]
        public byte[] PasswordSalt { get; set; }

        [Required]
        [Column("CreateDate")]
        public DateTime CreateDate { get; set; } = DateTime.Now;

        [Required]
        [Column("Active")]
        public bool Active { get; set; } = true;

        public virtual UserProfile UserProfile { get; set; }

        public virtual ICollection<Order> UserOrders { get; set; }
    }
}