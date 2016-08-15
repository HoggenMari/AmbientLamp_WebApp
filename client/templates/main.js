  var timeout;
  var clicker = 'mousedown';
  clicker = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
  var counter = 0;
  var currentID = 0;
  var cols, colsOld = 0;
  var visualBol = false;

  Router.configure({
    layoutTemplate: 'mainPage'
  });

  Router.route('/', {
    name: 'leaderboard',
    template: 'leaderboard'
  });

  Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function(){
      var currentList = this.params._id;
      //currentID = this.params._id;
      //console.log(this.params._id);
      currentID = this.params._id;
      return Visuals.findOne({ _id: currentList });
    }
  });

  Template.listPage.rendered = function() {

      console.log("COLOR COLOR");

      //counter = 0;
      console.log(Visuals.find({}));
      console.log(currentID);
      cols = Visuals.findOne({ _id: currentID }, {fields: {colors: 1}});
      console.log(cols);

      var $picker = document.getElementsByClassName('colorPicker');

      console.log($picker);

      visualBol = true;

      //var $picker = document.getElementById('colorPicker');
      //picker = tinycolorpicker($picker);

      //for (i = 0; i < cols.length; i++) {
      //    $('#colors').append("<div id='colorPicker" + i + "' class='colorPicker'><a class='color'><div class='colorInner'></div></a><div class='track'></div><ul class='dropdown'><li></li></ul> <input type='hidden' class='colorInput'/></div>");
      //}
  }

  Template.header.rendered = function (){

    //$('body').append("<script type='text/javascript' src='tinycolorpicker.js'></script>");

    //var $picker = document.getElementById('colorPicker');
    //picker  = tinycolorpicker($picker);

    //$('body').append("<script type='text/javascript'>window.onload = function(){var $picker = document.getElementById('colorPicker'),picker  = tinycolorpicker($picker);var $picker = document.getElementById('colorPicker2'),picker  = tinycolorpicker($picker);}</script>");

    elem.onchange = function() {
      console.log("clicked button");


      Checkbox.findAndModify(
          {name: 'Lamp'}, // query
          [['_id','asc']],  // sort order
          {$set: {checkedValue: elem.checked}}, // replacement, replaces only the field "hi"
          {}, // options
          function(err, object) {
            if (err){
              console.warn(err.message);  // returns error if no matching object found
            }else{
              console.dir(object);
            }
          });
    };

  }

  Template.settingsList.rendered = function(){
    console.log("test");

    //var elem = document.querySelector('.js-switch');
    //var init = new Switchery(elem);

  };

  Template.settingsList.helpers({
    settings: function () {
      return Settings.find({});
    },
    selectedSetting: function () {
      var setting = Settings.findOne(Session.get("selectedSetting"));
      return setting && setting.name;
    }
  });

  Template.settingsList.events({
    'click .inc': function () {
      Settings.update(Session.get("selectedSetting"), {$inc: {score: 5}});
    }
  });

  Template.setting.helpers({
    selected: function () {
      return Session.equals("selectedSetting", this._id) ? "selected" : '';
    }
  });

  Template.leaderboard.helpers({
    visuals: function () {
      return Visuals.find({});
    },
    selectedSetting: function () {
      var visual = Visuals.findOne(Session.get("selectedSetting"));
      return visual && visual.name;
    },
    incompleteCount: function() {
      return Visuals.find({ checked: { $ne: false } }).count();
    },
  });

  Template.leaderboard.rendered = function() {
    var elem = document.querySelector('.genius');
    var init = new Switchery(elem);
  }

  Template.visual.helpers({
    selected: function () {
      return Session.equals("selectedSetting", this._id) ? "selected" : '';
    }
  });

  Template.visual.events({
    'click .toggle-checked': function() {
      // Set the checked property to the opposite of its current value
      console.log(this._id);
      console.log(this.checked);
      Meteor.call('visual.setChecked', this._id, !this.checked);
    },
    'click .name': function() {
      console.log("tester");
      Meteor.call('visual.setActive', this._id, true);
    }
  });

  function increase(setting) {
    var count = Settings.findOne(setting, {fields: {score: 1} });
    if(count.score<100){
    	Settings.update(setting, {$inc: {score: 1}});
    }
  }

  function decrease(setting) {
    var count = Settings.findOne(setting, {fields: {score: 1} });
    if(count.score>0){
    	Settings.update(setting, {$inc: {score: -1}});
    }
  }

  Template.setting.events({
    'touchstart .dec': function () {
      var setting = this._id;
      timeout = setInterval(function(){
      	decrease(setting);
      }, 25);
      return false;
    },
    'mousedown .dec': function () {
      var setting = this._id;
      timeout = setInterval(function(){
      	decrease(setting);
      }, 25);      
      return false;
    },
    'mouseup .dec': function () {
      clearInterval(timeout);
      return false;
    },
    'touchend .dec': function () {
      clearInterval(timeout);
      return false;
    },
    'touchstart .inc': function () {
      var setting = this._id;
      timeout = setInterval(function(){
      	increase(setting);
      }, 25);
      return false;
    },
    'mousedown .inc': function () {
      var setting = this._id;
      timeout = setInterval(function(){
      	increase(setting);
      }, 25);      
      return false;
    },
    'mouseup .inc': function () {
      clearInterval(timeout);
      return false;
    },
    'touchend .inc': function () {
      clearInterval(timeout);
      return false;
    },
    'click .inc': function() {
      var setting = this._id;
      increase(setting);
    },
    'click .dec': function() {
      var setting = this._id;
      decrease(setting);
    }
  });

  Template.visual.rendered = function () {
    counter = 0;
    console.log("call visual");
    visualBol = true;
    //console.log(currentID);
  }

  Template.color.rendered = function () {

      console.log(this);

      console.log(colsOld);
      cols = Visuals.findOne(currentID, {fields: {colors: 1}}).colors;
      console.log(cols);



      for(i=0; i<cols.length; i++){
          if(colsOld[i] != cols[i]){
              break;
          }
      }



      //console.log("cols length");
      var count = cols.length;


       //$('#colors').remove('div #colorPicker');
       //$('#colors').append("<div id='colorPicker" + counter + "' class='colorPicker'><a class='color'><div class='colorInner'></div></a><div class='track'></div><ul class='dropdown'><li></li></ul> <input type='hidden' class='colorInput'/></div>");


        //var $picker = document.getElementsByClassName('colorPicker');
        //console.log($picker[counter])
        picker = tinycolorpicker(this.firstNode);
        if(counter<cols.length) {
            console.log("false");
            var col = cols[counter];
        }else{
            console.log("true");
            var col = cols[i];
        }
        console.log("COL "+i+" "+counter);
        //var col1 = col.color;

          picker.setColor(col);

          //console.log(col);
          // visualBol = false;

          colsOld = Visuals.findOne(currentID, {fields: {colors: 1}}).colors;

      counter++;
      /*if(counter<cols.length) {
          counter++;
      }else{
          counter=1;
      }*/
  }

  function keyValue(key, value){
      this.Key = key;
      this.Value = value;
  };

  Template.listPage.events({
      'click .track': function() {
          var color_array = [];
          for (i = 0; i < $('.colorInput').length; i++) {
              console.log($('input').get(i).getAttribute('value'));
              color_array.push($('input').get(i).getAttribute('value'));
          }
          Visuals.update(currentID, { $unset: { colors: ""}});
          Visuals.update(currentID, { $set: { colors: color_array} });
          //location.reload();
      },
      'touchend .track': function() {
          var color_array = [];// = [ {color: "#000000"}, {color: "#000000"}, {color: "#000000"}];
          for (i = 0; i < $('.colorInput').length; i++) {
              console.log($('input').get(i).getAttribute('value'));
              color_array.push($('input').get(i).getAttribute('value'));
          }
          Visuals.update(currentID, { $set: { colors: color_array} });
      }
  });