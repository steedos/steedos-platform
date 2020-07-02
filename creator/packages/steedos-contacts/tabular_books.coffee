    TabularTables.contactsBooks = new Tabular.Table({
      name: "contactsBooks",
      collection: db.address_books,
      columns: [
        {
          data: "_id", 
          title: '<input type="checkbox" name="reverse" id="reverse">',
          orderable: false,
          width:'1px',
          render:  (val, type, doc) ->
            input = '<input type="checkbox" class="contacts-list-checkbox" name="contacts_ids" id="contacts_ids" value="' + doc._id + '" data-name="' + doc.name + '" data-email="' + doc.email + '"'

            if TabularTables.contactsBooks.customData?.defaultValues?.getProperty("email").includes(doc.email)
              input += " checked "

            input += ">"
            return input
        },
        {
          data: "name", 
          render:  (val, type, doc) ->
            return "<div class='contacts-name'>" + doc.name + "</div>"
        },
        {
          data: "email",
          render:  (val, type, doc) ->
            return "<div class='contacts-email'>" + doc.email + "</div>"
        }
      ],

      #select:
      #  style: 'single'
      dom: "tp",
      order:[[1,"desc"]]
      extraFields: ["_id", "name", "email"],
      lengthChange: false,
      pageLength: 15,
      info: false,
      searching: true,
      responsive: 
        details: false
      autoWidth: false,
      changeSelector: (selector, userId) ->
        unless userId
          return {_id: -1}
        owner = selector.owner
        unless owner
          if selector?.$and?.length > 0
            owner = selector.$and.getProperty('owner')[0]
        unless owner
          return {_id: -1}
        unless owner.toString() == userId.toString()
          return {_id: -1}
        return selector

      #scrollY:        '400px',
      #scrollCollapse: true,
      pagingType: "numbers"

    });