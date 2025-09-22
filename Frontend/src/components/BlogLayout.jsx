import React, { useState } from 'react';
import { Search, Calendar, User, Tag } from 'lucide-react';

const BlogLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const blogPosts = [
    {
      id: 1,
      title: "Going all-in with millennial design",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      image: "/images/dining.png",
      date: "14 Oct 2022",
      author: "Admin",
      category: "Wood"
    },
    {
      id: 2,
      title: "Exploring new ways of decorating",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      image: "/images/dining.png",
      date: "14 Oct 2022",
      author: "Admin",
      category: "Handmade"
    },
    {
      id: 3,
      title: "Handmade pieces that took time to make",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      image: "/images/dining.png",
      date: "14 Oct 2022",
      author: "Admin",
      category: "Wood"
    }
  ];

  const categories = [
    { name: "Crafts", count: 2 },
    { name: "Design", count: 8 },
    { name: "Handmade", count: 7 },
    { name: "Interior", count: 1 },
    { name: "Wood", count: 6 }
  ];

  const recentPosts = [
    {
      title: "Going all-in with millennial design",
      date: "03 Aug 2022",
      image: "/images/living.png"
    },
    {
      title: "Exploring new ways of decorating",
      date: "03 Aug 2022",
      image: "/images/sofa.png"
    },
    {
      title: "Handmade pieces that took time to make",
      date: "03 Aug 2022",
      image: "/images/living.png"
    },
    {
      title: "Modern home in Milan",
      date: "03 Aug 2022",
      image: "/images/sofa.png"
    },
    {
      title: "Colorful office redesign",
      date: "03 Aug 2022",
      image: "/images/dining.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Blog Posts Section */}
          <div className="lg:w-2/3">
            <div className="space-y-12">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white">
                  {/* Post Image */}
                  <div className="mb-6">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Post Meta */}
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      <span>{post.category}</span>
                    </div>
                  </div>
                  
                  {/* Post Title */}
                  <h2 className="text-2xl md:text-3xl font-medium mb-4 text-gray-900 hover:text-amber-600 cursor-pointer transition-colors">
                    {post.title}
                  </h2>
                  
                  {/* Post Excerpt */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  {/* Read More Button */}
                  <button className="text-black font-medium hover:text-amber-600 transition-colors border-b border-black hover:border-amber-600 pb-1">
                    Read more
                  </button>
                </article>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button 
                className="w-10 h-10 rounded-full bg-amber-600 text-white font-medium"
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-amber-600 font-medium">
                Next
              </button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-8">
              
              {/* Search Box */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium mb-6 text-gray-900">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center text-gray-600 hover:text-amber-600 cursor-pointer transition-colors">
                      <span className="capitalize">{category.name}</span>
                      <span className="text-sm">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Posts */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium mb-6 text-gray-900">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="flex gap-3 cursor-pointer group">
                      <div className="w-20 h-16 flex-shrink-0">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;