using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FootballPlayer.Models
{
    public class Player
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int ShirtNo { get; set; }
        public int Appearances { get; set; }
        public int Goals { get; set; }
        public PlayerPositions Position { get; set; }

        [NotMapped]
        public string PositionName => Position.ToString();

        [NotMapped]
        public decimal GoalsPerMatch => Math.Round((decimal)Goals / (decimal)Appearances, 2);
    }
}
