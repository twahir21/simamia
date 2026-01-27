```tsx
return (
    // 1. Changed ScrollView to View to prevent the nesting error
    <View className="flex-1 bg-white p-4">
      {/* Feedback Toast */}
      {feedbackProduct && (
        <Animated.View 
          style={[styles.feedbackToast, { opacity: fadeAnim }]}
          className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center z-50"
        >
          <Feather name="check-circle" size={24} color="#10b981" />
          <View className="ml-3 flex-1">
            <Text className="text-green-800 font-semibold">Added to cart!</Text>
            <Text className="text-green-700 text-sm">{feedbackProduct.name}</Text>
          </View>
          <Text className="text-green-600 font-bold">${feedbackProduct.price}</Text>
        </Animated.View>
      )}
      
      {/* Search Bar */}
      <View className="relative mb-6 z-40"> 
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1 border border-gray-400">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            onKeyPress={handleKeyPress}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (suggestions.length > 0) {
                addToCart(suggestions[0]);
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <Entypo name="circle-with-cross" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <View className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-400 max-h-80 z-50">
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              // nestedScrollEnabled is good practice but won't fix the error if the parent is a ScrollView
              nestedScrollEnabled={true} 
            />
            
            <View className="px-4 py-2 border-t border-gray-300 bg-gray-100">
              <Text className="text-gray-500 text-xs">
                Press Enter to add the first result • {suggestions.length} results
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Recent Searches */}
      {!showSuggestions && (
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="cart-variant" size={20} color="#4b5563" className="mr-2" />
              <Text className="text-gray-700 font-semibold text-lg">Recently Added Products</Text>
            </View>
            <Text className="text-gray-500 text-sm">{recentSearches.length}/10</Text>
          </View>
          
          <View className="flex-row flex-wrap">
            {recentSearches.map(renderRecentItem)}
          </View>
          
          {recentSearches.length === 0 && (
            <View className="flex-1 items-center justify-center mt-10">
              <Entypo name="emoji-sad" size={64} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4">No recent products</Text>
              <Text className="text-gray-400 text-center mt-2">
                Search and add products to see them here
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );