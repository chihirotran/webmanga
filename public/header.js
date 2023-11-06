document.addEventListener("DOMContentLoaded", function() {
    
    
        
    });
    const data1 = ["apple", "banana", "cherry", "date", "grape", "kiwi", "lemon", "mango", "orange", "pear", "strawberry", "watermelon"];
let selectedItems = [];

function showSuggestions(event) {
  const input = document.getElementById("search");
  const suggestions = document.getElementById("suggestions");
  const selectedItemsDiv = document.getElementById("selected-items");
  const keyword = input.value.toLowerCase();
  const filteredData = data1.filter(item => item.toLowerCase().startsWith(keyword));

  suggestions.innerHTML = ""; // Xóa nội dung cũ

  if (filteredData.length === 0) {
    suggestions.style.display = "none";
  } else {
    suggestions.style.display = "block";

    // Tạo các mục chọn cho từng mục gợi ý
    filteredData.forEach(item => {
      const suggestionItem = document.createElement("div");

      const clickableItem = document.createElement("span");
      clickableItem.textContent = item;
      clickableItem.className = "clickable"; // Đặt một lớp cho mục chọn

      suggestionItem.appendChild(clickableItem);
      suggestions.appendChild(suggestionItem);

      // Xử lý sự kiện khi nhấp vào mục
      clickableItem.addEventListener("click", function() {
        selectedItems.push(item); // Thêm mục vào mảng selectedItems
        selectedItemsDiv.innerHTML = selectedItems.join(', '); // Hiển thị các mục đã chọn trong selectedItemsDiv
        input.value = ''; // Xóa trường nhập dữ liệu
        suggestions.style.display = "none"; // Ẩn danh sách gợi ý
      });
    });
  }

  if (event.key === "Enter") {
    selectedItems.push(keyword);
    selectedItemsDiv.innerHTML = selectedItems.join(', ');
    input.value = '';
    suggestions.style.display = "none";
  }
}

    