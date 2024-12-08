import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { House, Film, Tv, Bookmark, Menu, X, User, Bell, Search} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Movie } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchResults = (movies: Movie[]) => {
    const filteredResults = movies.filter((movie) => {
      if (movie.media_type === 'tv') {
        return movie.name.toLowerCase().includes(searchTerm.toLowerCase()) || movie.first_air_date;
      } else if (movie.media_type === 'movie') {
        return movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || movie.release_date;
      }
      return false;
    });
    setSearchResults(filteredResults);
    setIsSearchActive(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCardClick = (movie: { id: number, media_type: string }) => {
    if (movie.media_type === 'movie') {
      window.location.href = `/videopage/${movie.id}`;
    } else if (movie.media_type === 'tv') {
      window.location.href = `/tv-videopage/${movie.id}`;
    }
  };
  
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchActive(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const NavigationLinks = () => (
    <>
      <Link to="/" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <House className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </Link>
      <Link to="/movies" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Bookmark className="w-5 h-5" />
        <span className="font-medium">Movies</span>
      </Link>
      <Link to="/tv-series" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Film className="w-5 h-5" />
        <span className="font-medium">TV Series</span>
      </Link>
      <Link to="/coming-soon" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Tv className="w-5 h-5" />
        <span className="font-medium">Coming Soon</span>
      </Link>
      <Link to="/friends" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <User className="w-5 h-5" />
        <span className="font-medium">Friends</span>
      </Link>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#13141A] to-[#1a1c25] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 p-6">
        <h2 className="sparkly-text mb-10 mt-[-8px]">CineNova</h2>

        <div className="flex flex-col space-y-2">
          <NavigationLinks />
        </div>
        <div className="mt-auto pt-6 space-y-2 border-t border-gray-700/50">
          <Link to="/settings" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
            <span className="font-medium">Settings</span>
          </Link>
          <Link to="/logout" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
            <span className="font-medium">Log out</span>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#1C1E26]/90 backdrop-blur-lg border-b border-gray-800/50">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={toggleMenu} 
            className="p-2 hover:bg-blue-500/10 rounded-xl transition-colors active:scale-95" 
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex-grow">
          CineNova
          </h2>

          <button
            onClick={toggleSearch}
            className="p-2 hover:bg-blue-500/10 rounded-xl transition-colors active:scale-95"
            aria-label="Toggle search"
          >
            <Search className="w-6 h-6 text-white" />
          </button>

          <Avatar className="w-8 h-8 ring-2 ring-blue-500/20">
          <AvatarImage asChild>
      {/* Use the Lucide icon as the avatar image */}
      <User className="w-full h-full text-blue-400" />
    </AvatarImage>
            <AvatarFallback className="bg-blue-500/10 text-blue-400"><User /></AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 z-40 h-full w-72 bg-[#1C1E26]/95 backdrop-blur-xl transform transition-all duration-300 ease-out border-r border-gray-800/50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CineNova
            </h2>
            <button 
              onClick={toggleMenu} 
              className="p-2 hover:bg-blue-500/10 rounded-xl transition-colors active:scale-95" 
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <ScrollArea className="flex-1">
            <nav className="flex flex-col px-4 py-6 space-y-2" onClick={toggleMenu}>
              <NavigationLinks />
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center space-x-3 p-4 bg-blue-500/10 rounded-xl">
              <Avatar className="ring-2 ring-blue-500/20">
              <AvatarImage asChild>
      {/* Use the Lucide icon as the avatar image */}
      <User className="w-full h-full text-blue-400" />
    </AvatarImage>
                <AvatarFallback className="bg-blue-500/10 text-blue-400"><User /></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">CineNova</p>
                <p className="text-sm text-gray-400">Premium User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-64 mt-[-8px]">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between backdrop-blur-lg p-4 md:p-0 md:m-6 md:ml-5">
        <div className="relative w-64" onClick={toggleSearch}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search ..."
            
            readOnly
            className="w-full bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 pl-10"
          />
      </div>

          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center space-x-3">
              <span className="text-gray-300">CineNova</span>
              <Avatar className="ring-2 ring-blue-500/20 transition-all hover:ring-blue-500/40">
              <AvatarImage asChild>
      {/* Use the Lucide icon as the avatar image */}
      <User className="w-full h-full text-blue-400" />
    </AvatarImage>
                <AvatarFallback className="bg-blue-500/10 text-blue-400"><User /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Centered Search Bar and Results */}
        {isSearchActive && (
        <div 
          ref={searchResultsRef}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center px-4 md:px-0 pt-16 md:pt-0"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchActive(false)} />
          <div className="relative bg-[#1C1E26]/95 backdrop-blur-xl border border-gray-800/50 rounded-xl shadow-lg shadow-black/20 w-full max-w-[500px] mx-auto">
            <div className="p-4">
              <SearchBar 
                onSearchResults={handleSearchResults} 
                onSearchChange={handleSearchChange}
                inputRef={searchInputRef}
                initialValue={searchTerm}
              />
            </div>
            <ScrollArea className="h-[calc(100vh-40vh)] md:h-[calc(100vh-40vh)]">
  <div className="p-2 space-y-1">
    {searchResults.map((movie) => (
      <button
        key={movie.id}
        className="w-full flex items-center gap-4 p-3 hover:bg-blue-500/10 transition-colors rounded-xl group"
        onClick={() => handleCardClick(movie)}
      >
        <img
          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
          alt={movie.media_type}
          className="w-12 h-[72px] object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
            {movie.media_type === 'tv' ? movie.name : movie.title}
          </span>
          <span className="text-xs text-gray-400">
            {movie.media_type === 'tv' ? new Date(movie.first_air_date).getFullYear() : new Date(movie.release_date).getFullYear()}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {movie.media_type === 'tv' ? 'TV Show' : 'Movie'} {/* Add media type */}
          </span>
        </div>
      </button>
    ))}
  </div>
</ScrollArea>

          </div>
        </div>
      )}
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide mt-20 md:mt-[-16px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;