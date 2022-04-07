using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("What is your name?");
            var name = Console.ReadLine();
            var currentDate = DateTime.Now;
            Console.WriteLine($"\nHello, {name}, on {currentDate:d} at {currentDate:t}!");
            Console.Write($"\nPress any key to exit...");
            //Console.ReadKey(true);
        }
    }
}
