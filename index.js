// Storage Controller

// Item Controller
const ItemCtrl = (() => {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Eggs", calories: 200 },
      // { id: 2, name: "Cookie", calories: 500 },
    ],
  };

  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      calories = parseInt(calories);

      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      const newItem = new Item(ID, name, calories);

      // put item to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: () => {
      let totalCalories = 0;
      data.items.forEach((item) => (totalCalories += item.calories));

      return totalCalories;
    },
    logData: () => {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    itemList: "#item-list",
    itemInputName: "#item-name",
    itemInputCalories: "#item-calories",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    totalCalories: ".total-calories",
  };

  return {
    populateItemList: (items) => {
      let html = "";

      items.forEach((item) => {
        html += `
            <li class="collection-item" id="item-${item.id}">
              <span class="item-name">${item.name} : </span>
              <span class="item-calorie">${item.calories} Calories</span>
              <a href="#" class="secondary-content"
                ><i class="edit-item fa fa-pencil"></i
              ></a>
            </li>
        `;
      });

      // Insert List Item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemInputName).value,
        calories: document.querySelector(UISelectors.itemInputCalories).value,
      };
    },
    addItemToList: (item) => {
      // Show list and clear all btn
      document.querySelector(UISelectors.itemList).style.display = "block";
      document.querySelector(UISelectors.clearBtn).style.display = "block";

      // Create li
      const li = document.createElement("li");
      li.classList.add("collection-item");
      li.id = `item-${item.id}`;

      li.innerHTML = `
        <span class="item-name">${item.name} : </span>
        <span class="item-calorie">${item.calories} Calories</span>
        <a href="#" class="secondary-content"
          ><i class="edit-item fa fa-pencil"></i
        ></a>
      `;

      // Insert li at the end of the list item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemInputName).value = "";
      document.querySelector(UISelectors.itemInputCalories).value = "";
    },
    clearEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      // document.querySelector(UISelectors.deleteBtn).style.display = "none";
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
      document.querySelector(UISelectors.clearBtn).style.display = "none";
    },
    getSelectors: () => {
      return UISelectors;
    },
  };
})();

// App Controller
const App = ((ItemCtrl, UICtrl) => {
  // Get UI Selectors from UI Controller
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = () => {
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", submitItem);
  };

  // Add Item To List
  const submitItem = (e) => {
    e.preventDefault();

    // Get input value from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      // Add item to items array
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI List
      UICtrl.addItemToList(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories
      UICtrl.showTotalCalories(totalCalories);

      // Clear Input
      UICtrl.clearInput();
    }
  };

  return {
    init: () => {
      // Call load event listeners
      loadEventListeners();

      // Hide update/delete/back buttons
      UICtrl.clearEditState();

      // Get items from Item Controller
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Paste items to UI Controller
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories
      UICtrl.showTotalCalories(totalCalories);
    },
  };
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
