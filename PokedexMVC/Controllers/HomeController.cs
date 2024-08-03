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
        private readonly int PerPage = 24;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
            var rootPath = environment.ContentRootPath;
            var path = Path.Combine(rootPath, "pokemon.json");
            string jsonData = System.IO.File.ReadAllText(path);
            Pokemon = JsonSerializer.Deserialize<List<Pokemon>>(jsonData);
        }


        [HttpGet]
        public IActionResult Index()
        {
            List<Pokemon> pokemons = Pokemon.Take(PerPage).ToList();

            HomeViewModel viewModel = new HomeViewModel();
            viewModel.Pokemons = pokemons;
            viewModel.Page = 1;
            viewModel.MaxPage = (int)Math.Ceiling((double)Pokemon.Count / (double)PerPage);
            return View(viewModel);
        }

        [HttpGet]
        public IActionResult Search([FromQuery] string s, int page = 1)
        {
            var viewModel = new HomeViewModel();
            viewModel.Page = page;

            List<Pokemon> pokemons = new List<Pokemon>();
            if (string.IsNullOrEmpty(s))
            {
                pokemons = Pokemon.Skip(PerPage * (page-1)).Take(PerPage).ToList();
                viewModel.MaxPage = (int)Math.Ceiling((double)Pokemon.Count / (double)PerPage);
            }
            else
            {
                bool isInt = int.TryParse(s, out int number);
                
                if (isInt)
                {
                    pokemons = Pokemon.Where(p => p.number.ToString().Contains(s)).ToList();
                }
                else
                {
                    pokemons = Pokemon.Where(p => p.name.Contains(s, StringComparison.CurrentCultureIgnoreCase)).ToList();
                }

                viewModel.MaxPage = (int)Math.Ceiling((double)pokemons.Count / (double)PerPage);
                pokemons = pokemons.Skip(PerPage * (page - 1)).Take(PerPage).ToList();
            }
            viewModel.Pokemons = pokemons;

            return page == 1 ? PartialView("_PokemonCardContainer", viewModel) : PartialView("_PokemonCardList", viewModel);
        }

    }
}
