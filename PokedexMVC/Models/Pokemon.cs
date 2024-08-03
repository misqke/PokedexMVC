namespace PokedexMVC.Models
{
    public class Pokemon
    {
        public int number { get; set; }
        public string name { get; set; }
        public PokemonImageContainer image { get; set; }
        public PokemonStatsContainer stats { get; set; }
        public string height { get; set; }
        public string weight { get; set; }
        public string category { get; set; }
        public string description1 { get; set; }
        public string description2 { get; set; }
        public List<string> type { get; set; }
    }

    public class PokemonStatsContainer
    {
        public int hp { get; set; }
        public int attack { get; set; }
        public int defense { get; set; }
        public int specialAttack { get; set; }
        public int specialDefense { get; set; }
        public int speed { get; set; }
    }

    public class PokemonImageContainer
    {
        public string large { get; set; }
        public string small { get; set; }
    }
}
