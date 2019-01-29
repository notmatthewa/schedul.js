function Schedule(o){
    var options = o ? o : {}

    this.getDefault = (option, def) => {
        return option != undefined ? option : def;
    }

    this.idSuffix =         this.getDefault(options.idSuffix, "");
    this.idPrefix =         this.getDefault(options.idPrefix, ""); 

    this.getId = (id) => {
        var returnId = id;
        if(this.idSuffix) returnId = returnId + this.idSuffix;
        if(this.idPrefix) returnId = this.idPrefix + returnId;
        return returnId;
    }

    this.collumns =         this.getDefault(options.collumns, 7);
    this.rows =             this.getDefault(options.rows, 6);
    this.chartType =        this.getDefault(options.chartType, "Month");
    this.chartType =        options.rows || options.collumns ? "Custom" : this.chartType; 
    this.elementId =        this.getDefault(options.elementId, "Scheduler");
    this.title =            this.getDefault(options.title, "Schedule");
    this.daysList =         this.getDefault(options.daysList, ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    this.monthsList =       this.getDefault(options.monthList, ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    this.displayedDate =    this.getDefault(options.displayedDate, new Date());
    this.containerId =      this.getDefault(this.getId(options.containerId), this.getId(`schedule-container`));
    this.headerId =         this.getDefault(this.getId(options.headerId), this.getId("schedule-header"))
    this.tableContainerId = this.getDefault(this.getId(options.tableContainerId), this.getId("schedule-table-container"));
    this.nextButtons =      this.getDefault(options.nextButtons, true);
    this.leftButtonId =     this.getDefault(this.getId(options.leftButtonId), this.getId("schedule-left-button"));
    this.rightButtonId =    this.getDefault(this.getId(options.rightButtonId), this.getId("schedule-right-button"));
    this.buttonContainerId= this.getDefault(this.getId(options.buttonContainerId), this.getId("schedule-button-container"));
    this.enableDateText =   this.getDefault(options.enableDateText, true);
    this.displayMonthId =   this.getDefault(this.getId(options.displayMonthId), this.getId("schedule-dispaly-month"))

    this.init = () => {
        var element = options.insertElement ? document.getElementById(options.insertElement) : document.body;
        element.innerHTML += `
            <div class="schedule-container" id="${this.containerId}">
                <div class="schedule-header" id="${this.headerId}">
                    <div class="display-month" id="${this.displayMonthId}"></div>
                    <div class="schedule-title">${this.title}</div>
                </div>
                <div id="${this.tableContainerId}">
                    <table class="schedule-table" id="${this.elementId}">
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        if(this.nextButtons){
            document.getElementById(this.headerId).innerHTML += `
            <div class="next-button-container" id="${this.buttonContainerId}">
                <div class="next-button next-button-left" id="${this.leftButtonId}"><</div>
                <div class="next-button next-button-right" id="${this.rightButtonId}">></div>
            </div>`;
        }
        this.insertRows();
        this.setChart();
    }

    this.insertRows = () => {
        var tableElement = document.getElementById(this.elementId);
        var tbodyElement = tableElement.getElementsByTagName("tbody")[0];
        tbodyElement.innerHTML += `  
        <tr class="head"></tr>
        `
        tbodyElement.getElementsByClassName("head")[0].innerHTML += `
            <th>${this.getDayName(0)}</th>
            <th>${this.getDayName(1)}</th>
            <th>${this.getDayName(2)}</th>
            <th>${this.getDayName(3)}</th>
            <th>${this.getDayName(4)}</th>
            <th>${this.getDayName(5)}</th>
            <th>${this.getDayName(6)}</th>
        `;
        for(var row = 0; row < this.rows; row++){
            tbodyElement.innerHTML += `<tr class="${row}"></tr>`;
            var currentRowElement = tableElement.getElementsByClassName(row)[0];
            for(var col = 0; col < this.collumns; col++){
                currentRowElement.innerHTML += `
                    <td class="${row}x${col}" id="${row}x${col}">
                        <div class="schedule-cell">
                            <div class="cell-header">
                                <div class="corner" id="corner-${row}x${col}" class="schedule-corner">${row}x${col}</div>
                            </div>
                            <div class="schedule-area schedule-area-${row}x${col}"></div>
                        </div>
                    </td>
                `;
            }
        }
    }

    this.getDay = (date) => {
        return new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth()).getDay();
    }

    this.getMonthNum = (month) => {
        return month ? month.getMonth() : this.displayedDate.getMonth();
    }

    this.getDayName = (dayNum) => {
        return this.daysList[dayNum];
    }

    this.getMonthName = (monthNum) => {
        return monthNum ? this.monthsList[monthNum] : this.monthsList[this.getMonthNum()];
    }

    //returns a 2 dimensional array with size of ROWxCOL
    this.getMonth = (date) => {
        var list = [];
        var currentMonth = new Date(date.getYear(), date.getMonth())
        var currentDay = 0;
        for(var row = 0; row < this.rows; row++){
            list.push([]);
            for(var col = 0; col < this.collumns; col++){
                list[row].push(undefined);
            }
        }
        var monthStart = this.getDay(currentMonth);
        var count = 1;
        for(var i = monthStart; i < 40; i++){
            if(new Date(currentMonth).getMonth() == new Date(new Date(currentMonth).setDate(count)).getMonth()){
                list[Math.floor(i / 7)][i % 7] = count;
                count++
            }
        }
        return list;
    }

    this.setChart = () => {
        var data = this.getData();
        for(var row = 0; row < this.rows; row++){
            for(var col = 0; col < this.collumns; col++){
                var dayElement = document.getElementById(`corner-${row}x${col}`);
                var currentDate = data[row][col];
                if(currentDate){
                    dayElement.className = "schedule-corner";
                    dayElement.innerText = currentDate;
                } else {
                    dayElement.className = "schedule-corner empty";
                    dayElement.innerText = "-"; 
                }
            }
        }
        if(this.enableDateText) document.getElementById(this.displayMonthId).innerText = `${this.getMonthName()} ${this.displayedDate.getYear() + 1900}`;
        if(this.nextButtons) document.getElementById(this.leftButtonId).onclick = () => {
            this.lastDisplayedDate = this.displayedDate;
            this.displayedDate.setMonth(this.displayedDate.getMonth() - 1); this.setChart();
            if(this.onMonthChanged) this.onMonthChanged();
        }
        if(this.nextButtons) document.getElementById(this.rightButtonId).onclick = () => {
            this.lastDisplayedDate = this.displayedDate;
            this.displayedDate.setMonth(this.displayedDate.getMonth() + 1); this.setChart();
            if(this.onMonthChanged) this.onMonthChanged();
        }
    }

    this.getData = () => {
        var data = this.getMonth(this.displayedDate);
        if(this.chartType.toLowerCase() === "month") data = this.getMonth(this.displayedDate);
        return data;
    }
}