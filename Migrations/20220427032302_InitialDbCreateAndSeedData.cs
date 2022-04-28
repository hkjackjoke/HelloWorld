using Microsoft.EntityFrameworkCore.Migrations;

namespace FootballPlayer.Migrations
{
    public partial class InitialDbCreateAndSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShirtNo = table.Column<int>(type: "int", nullable: false),
                    Appearances = table.Column<int>(type: "int", nullable: false),
                    Goals = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Players",
                columns: new[] { "Id", "Appearances", "Goals", "Name", "Position", "ShirtNo" },
                values: new object[,]
                {
                    { 1, 268, 54, "Juan Mata", 3, 8 },
                    { 2, 130, 28, "Paul Pogba", 2, 6 },
                    { 3, 335, 0, "David de Gea", 0, 1 },
                    { 4, 200, 2, "Phil Jones", 1, 4 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Players");
        }
    }
}
