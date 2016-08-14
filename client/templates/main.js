  var timeout;
  var clicker = 'mousedown';
  clicker = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
  var counter = 0;
  var currentID = 0;
  var cols = 0;

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
      counter = 0;
      console.log(Visuals.find({}));
      console.log(currentID);
      cols = Visuals.findOne(currentID, {fields: {colors: 1}} ).colors;
      console.log(cols[0].color);
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
    //console.log(currentID);
  }

  Template.color.rendered = function () {
    counter++;

    cols = Visuals.findOne(currentID, {fields: {colors: 1}} ).colors;
    $('#colors').append("<div id='colorPicker"+counter+"' class='colorPicker'><a class='color'><div class='colorInner'></div></a><div class='track'></div><ul class='dropdown'><li></li></ul> <input type='hidden' class='colorInput'/></div>");

    var $picker = document.getElementById('colorPicker'+counter);
    picker  = tinycolorpicker($picker);
    var col = cols[counter-1].color;
    //var col1 = col.color;
    picker.setColor(col);

    console.log(col);
  }