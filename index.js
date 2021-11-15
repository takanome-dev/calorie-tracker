// Storage Controller

// Item Controller
const ItemCtrl = (() => {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Initial State
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Eggs", calories: 200 },
      // { id: 2, name: "Cookie", calories: 500 },
    ],
    currentItem: null,
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
    getItemById: (id) => {
      let found = null;

      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: (name, calories) => {
      calories = parseInt(calories);
      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    getTotalCalories: () => {
      let totalCalories = 0;
      data.items.forEach((item) => (totalCalories += item.calories));

      return totalCalories;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
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
    listItems: "#item-list li",
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
    updateItemFromList: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <span class="item-name">${item.name} : </span>
            <span class="item-calorie">${item.calories} Calories</span>
            <a href="#" class="secondary-content"
              ><i class="edit-item fa fa-pencil"></i
            ></a>
          `;
        }
      });
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemInputName).value = "";
      document.querySelector(UISelectors.itemInputCalories).value = "";
    },
    addItemToForm: () => {
      document.querySelector(UISelectors.itemInputName).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemInputCalories).value =
        ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    clearEditState: () => {
      UICtrl.clearInput();

      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
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
    // Add button click
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", submitItem);

    // Disable submit on enter
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editItem);

    // Update button click
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", updateItem);
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

  // Item update submit
  const editItem = (e) => {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);

      // Get item from items array
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Show edit state
      UICtrl.addItemToForm();
    }
  };

  // Update item
  const updateItem = (e) => {
    e.preventDefault();

    //  Get input item value
    const input = UICtrl.getItemInput();

    // Update item value from local data
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateItemFromList(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  return {
    init: () => {
      // Clear edit state
      UICtrl.clearEditState();

      // Call load event listeners
      loadEventListeners();

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
