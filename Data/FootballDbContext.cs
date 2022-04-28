using FootballPlayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FootballPlayer.Data
{
    public class FootballDbContext : DbContext
    {
        public FootballDbContext(DbContextOptions<FootballDbContext> options) : base(options)
        {

        }

        public DbSet<Player> Players { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>().HasData(
                new Player() { Id = 1, Name = "Juan Mata", ShirtNo = 8, Appearances = 268, Goals = 54, Position = PlayerPositions.Forward },
                new Player() { Id = 2, Name = "Paul Pogba", ShirtNo = 6, Appearances = 130, Goals = 28, Position = PlayerPositions.Midfielder },
                new Player() { Id = 3, Name = "David de Gea", ShirtNo = 1, Appearances = 335, Goals = 0, Position = PlayerPositions.Goalkeeper },
                new Player() { Id = 4, Name = "Phil Jones", ShirtNo = 4, Appearances = 200, Goals = 2, Position = PlayerPositions.Defender }
            );
        }
    }
}
