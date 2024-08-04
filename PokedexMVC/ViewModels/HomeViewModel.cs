using PokedexMVC.Models;

namespace PokedexMVC.ViewModels
{
    public class HomeViewModel
    {
        public List<Pokemon> Pokemons { get; set; }
        public int Page { get; set; }
        public int MaxPage { get; set; }
        public List<string> Types { get; set; }
    }
}
