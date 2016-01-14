
Items = new Mongo.Collection('items');

if (Meteor.isClient) {
    Template.registerHelper('checked', function(item) {
        var sess = Session.get('item');
        return sess && sess._id == item._id;
    });

    Template.hello.helpers({
        area: function() {
            return Session.get('area');
        },
        items: function() {
            var area = Session.get('area');
            if (!area) {
                area = Items.find().fetch()[0];
                Session.set('area', area);
            }
            return Items.find({area: area._id}, {sort: {created: -1}});
        },
        depth : function() {
            return Session.get('item') ? '' : {disabled: 'disabled'};
        }
    });

    Template.hello.events({
        'click .back': function(event) {
            Session.set('area', Items.find(Session.get('area').area).fetch()[0]);
        },

        'click .inside': function(event) {
            Session.set('area', Session.get('item'));
            Session.set('item', null);
        },

        'submit form': function(event) {
            event.preventDefault();

            var text = event.target.text;
            var item = Session.get('item');
            var area = Session.get('area');

            // comment
            if (item) {
                Items.update(item._id, {
                    $push: {
                        comments: text.value
                    }
                });
            }
            // new item
            else {
                Items.insert({
                    area: area ? area._id : null,
                    text: text.value,
                    comments: [],
                    created: new Date(),
                });
            }

            text.value = '';
        }
    });

    Template.item.events({
        'click': function(event) {
            var item = Session.get('item');
            if (!item || item._id != this._id) {
                Session.set('item', this);
            }
            else {
                Session.set('item', null);
            }
        }
    });
}
