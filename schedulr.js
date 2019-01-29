totalItems = 0;

function Scheduler(sch){

    this.schedule = sch;
    this.items = [];
    this.displayOnChange = true;

    this.onItemMouseOver = undefined;
    
    this.defaultOnItemMouseOver = (e) => {
        let clickedItem = this.items.filter(a => {
            return a.id == parseInt(e.path[0].id.split("#")[1]);
        })[0];
        clickedItem.defaultOnMouseOver(e);
        if(this.onItemMouseOver){
            this.onItemMouseOver();
        }
    }

    this.defaultOnItemMouseOut = (e) => {
        let clickedItem = scheduler.items.filter(a => {
            return a.id == parseInt(e.path[0].id.split("#")[1]);
        })[0];
        clickedItem.defaultOnMouseOut(); 
    }

    this.init = () => {
        this.scheduleElement = document.getElementById(this.schedule.elementId);
        this.scheduleElement.parentElement.innerHTML += `
            <div class="schedule-item-popup">
                <div class="schedule-item-popup-info popup-hidden"></div>
            </div>
        `
    }

    this.addItem = (date, duration, data) => {
        data = data ? data : {};
        var createdItem = new ScheduleItem();
        createdItem.startTime = date;
        createdItem.duration = duration;
        createdItem.scheduler = this;
        createdItem.schedule = this.schedule;
        createdItem.title = data.title ? data.title : 'Event:';
        createdItem.popupInfo = data.popupInfo ? data.popup : (e) => {return `
            <b>${e.title}</b><br>
            ${e.formatTime(e.startTime)} - ${e.formatTime(e.endTime)}<br>
        `};
        createdItem.generate();
        this.items.push(createdItem);
    }

    this.schedule.onMonthChanged = () => {
        if(this.displayOnChange){
            this.clearItems();
            this.displayItems();
        }
    }

    this.refresh = this.schedule.onMonthChanged;

    this.clearItems = () => {
        var scheduleId = this.schedule.elementId;
        var scheduleElement = document.getElementById(scheduleId);
        for(var row = 0; row < this.schedule.rows; row++){
            for(var col = 0; col < this.schedule.collumns; col++){
                scheduleElement.getElementsByClassName(`schedule-area-${row}x${col}`)[0].innerHTML = "";
            }
        }
    }

    this.displayItems = () => {
        var scheduleId = this.schedule.elementId;
        var scheduleElement = document.getElementById(scheduleId);
        var thisMonthItems = this.items.filter((x) => {
            return x.month == this.schedule.displayedDate.getMonth() && x.year == this.schedule.displayedDate.getFullYear();
        });
        for(var i = 0; i < thisMonthItems.length; i++){
            var currItem = thisMonthItems[i];
            var monthStart  = new Date(new Date(thisMonthItems.startTime).getYear(), new Date(thisMonthItems.startTime).getMonth())
            monthStart = schedule.getDay(monthStart);
            var currItemDate = (new Date(currItem.startTime).getDate() - 1) + monthStart;
            var row = Math.floor(currItemDate / 7);
            var col = currItemDate % 7;
            scheduleElement.getElementsByClassName(`schedule-area-${row}x${col}`)[0].innerHTML += `
                <div id="schedule-item#${currItem.id}" class="schedule-item">${currItem.formatTime()}</div>
            `;
        }
        for(var i = 0; i < thisMonthItems.length; i++){
            let currItem = thisMonthItems[i];
            let temp = document.getElementById(`schedule-item#${currItem.id}`);
            temp.onmouseover = this.defaultOnItemMouseOver;
            temp.onmouseleave = this.defaultOnItemMouseOut;
        }
    }
}

function ScheduleItem(){
    this.startTime = new Date();
    this.duration = 60;
    this.popup = true;
    this.id = totalItems;
    this.scheduler;
    this.schedule;

    totalItems += 1;

    this.defaultOnMouseOver = e => {
        if(this.popup){
            itemPopup = document.getElementById(this.schedule.elementId).parentElement.getElementsByClassName("schedule-item-popup")[0];
            itemPopup.children[0].className = "schedule-item-popup-info popup-shown";
            let clickedItemElem = e.path[0];
            var bodyRect = document.body.getBoundingClientRect(),
                elemRect = clickedItemElem.getBoundingClientRect(),
                offsetX   = elemRect.right,
                offsetY   = elemRect.bottom - (clickedItemElem.clientHeight / 2);
            itemPopup.style.top = offsetY + "px";
            itemPopup.style.left = offsetX + "px";
            itemPopup.children[0].innerHTML = this.popupInfo(this);
        }
    }

    this.defaultOnMouseOut = e => {
        if(this.popup){
            itemPopup = document.getElementById(this.schedule.elementId).parentElement.getElementsByClassName("schedule-item-popup")[0];
            itemPopup.children[0].className = "schedule-item-popup-info popup-hidden";
        }
    }

    this.onHover = undefined;

    this.generate = () => {
        this.endTime = new Date(new Date(this.startTime).setMinutes(new Date(this.startTime).getMinutes() + this.duration));
        this.month = new Date(this.startTime).getMonth();
        this.year = new Date(this.startTime).getFullYear();
    }

    this.formatTime = (date) => {
        var d = date ? new Date(date) : new Date(this.startTime);
        var hh = d.getHours();
        var m = d.getMinutes();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
          h = hh - 12;
          dd = "PM";
        }

        if (h == 0) h = 12;
        m = m < 10 ? "0" + m : m;
      
        return `${h}:${m} ${dd}`;
      }

}