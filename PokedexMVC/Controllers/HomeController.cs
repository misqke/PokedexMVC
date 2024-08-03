using Microsoft.AspNetCore.Mvc;
using PokedexMVC.Models;
using PokedexMVC.ViewModels;
using System;
using System.Diagnostics;
using System.Text.Json;

namespace PokedexMVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly List<Pokemon> Pokemon;
        private readonly IWebHostEnvironment _environment;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
            var rootPath = environment.ContentRootPath;
            var path = Path.Combine(rootPath, "data/pokemon.json");
            string jsonData = System.IO.File.ReadAllText(path);
            Pokemon = JsonSerializer.Deserialize<List<Pokemon>>(jsonData);
        }


        [HttpGet]
        public IActionResult Index()
        {
            List<Pokemon> pokemons = Pokemon.Where(p => p.number <= 24).ToList();

            HomeViewModel viewModel = new HomeViewModel();
            viewModel.Pokemons = pokemons;
            return View(viewModel);
        }

        [HttpGet]
        public IActionResult Search([FromQuery] string s)
        {
            bool isInt = int.TryParse(s, out int number);
            List<Pokemon> pokemons = new List<Pokemon>();
            if (isInt)
            {
                pokemons = Pokemon.Where(p => p.number.ToString().Contains(s)).ToList();
            }
            else
            {
                pokemons = Pokemon.Where(p => p.name.Contains(s, StringComparison.CurrentCultureIgnoreCase)).ToList();
            }
            var viewModel = new HomeViewModel();
            viewModel.Pokemons = pokemons;
            return PartialView("_PokemonCardContainer", viewModel);
        }
    }
}
