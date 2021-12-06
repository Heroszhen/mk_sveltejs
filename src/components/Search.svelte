<script>
    import SearchStore from "../stores/SearchStore.js";
    import DataStore from "../stores/DataStore.js";
    import { onDestroy } from 'svelte';

    let query = "";
    let data = {
        actresses:[],
        photos:[],
        videos:[]
    };
    let section = 1;
    const unsubscribe_data = DataStore.subscribe(value => {
		data = value;
        searchByKeywords();
	});

    const unsubscribe = SearchStore.subscribe(value => {
		query = value;console.log(query)
	});
	
    window.onload = () =>{
		/**
         * /recherche/s?query=abc
         * window.location.pathname : /recherche/s
         * window.location.search : ?query=abc
        */
       query = window.location.search.split('?query=')[1];console.log(query)
	};
    onDestroy(()=>{
        unsubscribe;
        unsubscribe_data;
    });

    function searchByKeywords(){
        
    }
</script>

<div id="search">
    <div class="container mb-2">
        <div class="row">
            <div class="col-12">
                <div class="meinuzi-color bg-white p-3">"{query}"</div>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div id="results_wrap">
                    <div id="titles">

                    </div>
                    <div id="allsections">
                        {#if section == 1}
                            <section>1</section>
                        {/if}
                        {#if section == 2}
                            <section>2</section>
                        {/if}
                        {#if section == 3}
                            <section>3</section>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

</style>