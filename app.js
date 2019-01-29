var schedule = new Schedule(); 
schedule.init();
let itemPopup;

var scheduler = new Scheduler(schedule);
scheduler.init()
scheduler.onItemHover = (e) =>{ 

    
}
scheduler.addItem(new Date().setDate(5), 99, {title: "Event 1 dude"});
scheduler.addItem(new Date().setDate(5), 10, {title: "ayyyysssss"});
scheduler.addItem(new Date().setDate(5), 14, {title: "HHsdfASDF"});
scheduler.addItem(new Date().setDate(5), 220, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(5), 650, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(5), 1230, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(5), 1550, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(12), 760, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(31), 870, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(-21), 340, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(-41), 20, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(-51), 550, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(51), 120, {title: "HHFKOS"});
scheduler.addItem(new Date().setDate(42), 6660, {title: "HHFKOS"});
scheduler.displayItems();