/*
Main javascript
I could use vue as a single application(running on nodejs for example) consuming data from a django backend but here
I am using vue integrated with django; that means i am using vuejs besides django templating system to build the UI 
I am using vuejs in standalone mode in this project because i wanted to keep it simple (no webpack build system)
I am declaring a single component 'autocomplete' with related methods
The main vue instance has the methods related to the table and data retrieval
I am using vue-resource to make ajax requests to the django backend
*/

//Vuejs uses double curly braces so we dont want to interfere with django template strings
Vue.config.delimiters = ["[[","]]"] 


Vue.component('autocomplete', {
  template: '\
    <div style="position:relative;width:20%;margin:auto;padding-bottom: 30px;"\
     v-bind:class="{\'open\':openSuggestion}">\
    <input placeholder="search" class="form-control col-sm-8" type="text" v-model="selection"\
        @input = \'change\'\
    />\
    <ul class="dropdown-menu">\
        <li v-for="suggestion in matches" track-by="$index"\
            v-bind:class="{\'active\': isActive($index)}"\
            @click="suggestionClick($index)"\
        >\
            <a href="#">[[ suggestion ]]</a>\
        </li>\
    </ul>\
</div>\
  ',
    data: function () {
        return {
            open: false //suggestions are not open by default
        }
    },
    props: {
        suggestions: { //where to search
            type: Array,
            required: true
        },
        selection: { // result of the search
            type: String,
            required: true,
            twoWay: true
        }
    },
    computed: {
        // the magic
        matches() {
            return this.suggestions.filter((str) => {
                return str.indexOf(this.selection) > -1;
            });
        },
        openSuggestion() {
            return this.selection !== "" &&
                   this.matches.length != 0 &&
                   this.open === true;
        }
    },
    methods: {
        change() {
            if (this.open == false) {
                this.open = true;
            }
        },
        suggestionClick(index) {
            this.selection = this.matches[index];
            this.open = false;
            this.getRecord(this.matches[index]);
        },
        getRecord: function (name) {
            this.$http.get('http://localhost:8000/record/'.concat(name))
                .then(function (response) {
                    var author = JSON.parse(response.data["author"]);

                    if(author[0] === undefined) {
                        alert('Please select an author not a book');
                        return;
                    }
                    author = author[0].fields.name;
                    var books = JSON.parse(response.data["books"]);
                    data = [];

                    for(var key in books) {
                        data.push({name: author, book: books[key].fields.book});
                    }
                    app.oneAuthor = true; 
                    app.authorEntries =  data;
            },
            function (err) {
                console.log(err);
            });
        }
    }

})


var app = new Vue({

    el: '#app',
    component: 'autocomplete',
    data: {
        apptitle: 'Library search with autocomplete',
        entries: [], //all table records
        authorEntries: [], //author records
        searchList: [], //where to search
        value: '', //what to search / the input
        oneAuthor: false //view all authors or just one
    },
    methods: {
        addRecord: function () {
            var newAuthor = {
                name: this.author.trim(),
                book: [{ "book": this.book.trim() }]
            };
            this.$http.post('http://localhost:8000/api/records/', newAuthor);
            this.getRecords();
        },
        removeRecord: function (index) {
            this.$http.delete('http://localhost:8000/api/records/'.concat(this.entries[index].id));
            this.entries.splice(index, 1);
        },
        getRecords: function () {
            this.oneAuthor = false;
            this.$http.get('http://localhost:8000/api/records/')
                .then(function (response) {
                    //Wierd response data structure coming from the backend
                    for(let i in response.data) { //for each author
                        this.searchList.push(response.data[i].name);
                        for(var j in response.data[i].book) { //for each book of an author
                            this.searchList.push(response.data[i].book[j].book);
                        }
                    }
                    this.searchList = _.uniq(this.searchList);
                    this.entries = response.data;
            },
            function (err) {
                console.log(err);
            });
        },
        viewOnGithub: function() {
            window.open('https://github.com/idzer0lis/library', '_blank');
        }
    },
    ready: function() { 
        this.getRecords();
    
    }
});
