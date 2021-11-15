// Storage Controller
const StorageCtrl = (() => {
  return {
    getItemFromLocalStorage: () => {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    setItemToLocalStorage: (item) => {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }

      return items;
    },
    updateItemFromLocalStorage: (updatedItem) => {
      const items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromLocalStorage: (id) => {
      const items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromLocalStorage: () => localStorage.removeItem("items"),
  };
})();

// Item Controller
const ItemCtrl = (() => {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Initial State
  const data = {
    items: StorageCtrl.getItemFromLocalStorage(),
    currentItem: null,
  };

  return {
    getItems: () => data.items,
    addItem: (name, calories) => {
      calories = parseInt(calories);

      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      const newItem = new Item(ID, name, calories);

      // push newItem to items array
      data.items.push(newItem);

      return newItem;
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
    deleteItem: (id) => {
      const ids = data.items.map((item) => item.id);

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearItems: () => (data.items = []),
    getItemById: (id) => {
      let found = null;

      data.items.forEach((item) => {
        if (item.id === id) {
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
    setCurrentItem: (item) => (data.currentItem = item),
    getCurrentItem: () => data.currentItem,
    logData: () => data,
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
    getItemInput: () => ({
      name: document.querySelector(UISelectors.itemInputName).value,
      calories: document.querySelector(UISelectors.itemInputCalories).value,
    }),
    addItemToList: (item) => {
      // Show list and clear btn
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
    deleteItemFromList: (id) => {
      const item = document.querySelector(`#item-${id}`);

      item.remove();
    },
    clearItemsFromList: () =>
      (document.querySelector(UISelectors.itemList).innerHTML = ""),
    showTotalCalories: (totalCalories) =>
      (document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories),
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
    getSelectors: () => UISelectors,
  };
})();

// App Controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
  // Get UI Selectors from UI Controller
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = () => {
    // Add button event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addItem);

    // Disable submit when click enter
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editItem);

    // Update button event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", updateItem);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteItem);

    // Clear all button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearItems);
  };

  // Add item to ui list
  const addItem = (e) => {
    e.preventDefault();

    // Get input value from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      // Add item to items array
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI List
      UICtrl.addItemToList(newItem);

      // Add item to local storage
      StorageCtrl.setItemToLocalStorage(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories
      UICtrl.showTotalCalories(totalCalories);

      // Clear Input
      UICtrl.clearInput();
    }
  };

  // edit item from ui list
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

  // Update item from ui list
  const updateItem = (e) => {
    e.preventDefault();

    //  Get input item value
    const input = UICtrl.getItemInput();

    // Update item value from local data
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI list item
    UICtrl.updateItemFromList(updatedItem);

    // Update local storage
    StorageCtrl.updateItemFromLocalStorage(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  // Delete item from ui list
  const deleteItem = (e) => {
    e.preventDefault();

    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete currentItem from local data
    ItemCtrl.deleteItem(currentItem.id);

    // Delete item from UI
    UICtrl.deleteItemFromList(currentItem.id);

    // Delete item from local storage
    StorageCtrl.deleteItemFromLocalStorage(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  // Clear all items
  const clearItems = (e) => {
    e.preventDefault();

    // Clear items from local data
    ItemCtrl.clearItems();

    // clear items from ui list
    UICtrl.clearItemsFromList();

    // Clear items from local storage
    StorageCtrl.clearItemsFromLocalStorage();

    // Hide list item
    UICtrl.hideList();

    // Clear edit state
    UICtrl.clearEditState();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories
    UICtrl.showTotalCalories(totalCalories);
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
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();
