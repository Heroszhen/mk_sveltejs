<script>
    import SearchStore from "../stores/SearchStore.js";
    import PageStore from '../stores/PageStore.js';
    import DataStore from "../stores/DataStore.js";
    import { onDestroy } from 'svelte';
    import { Link } from "svelte-navigator";

    PageStore.set("");
    let query = "";
    let data = {
        actresses:[],
        photos:[],
        videos:[]
    };
    let data2 = {
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
		query = value;
        searchByKeywords();
	});
	
    window.onload = () =>{
		/**
         * /recherche/s?query=abc
         * window.location.pathname : /recherche/s
         * window.location.search : ?query=abc
        */
       query = window.location.search.split('?query=')[1];
       searchByKeywords();
	};
    onDestroy(()=>{
        unsubscribe;
        unsubscribe_data;
    });

    function searchByKeywords(){ 
        data2 = {
            actresses:[],
            photos:[],
            videos:[]
        };
        data["actresses"].forEach(elm=>{
            if(elm["name"].toLowerCase().includes(query.toLowerCase()))data2["actresses"].push(elm);
        });
        data["photos"].forEach(elm=>{
            if(elm["name"].toLowerCase().includes(query.toLowerCase()))data2["photos"].push(elm);
        });
        data["videos"].forEach(elm=>{
            if(elm["name"].toLowerCase().includes(query.toLowerCase()) || elm["actressname"].toLowerCase().includes(query.toLowerCase()))data2["videos"].push(elm);
        });
    }

    function switchSection(s){
        section = s;
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
            <div class="col-12 ">
                <div id="results_wrap">
                    <div id="titles">
                        <div class="onetitle" class:active={section==1} on:click="{()=>switchSection(1)}">Actrices</div>
                        <div class="onetitle" class:active={section==2} on:click="{()=>switchSection(2)}">Photos</div>
                        <div class="onetitle" class:active={section==3} on:click="{()=>switchSection(3)}">Videos</div>
                    </div>
                    <div id="allsections">
                        {#if section == 1}
                            <section id="s1">
                                <div class="wrap">
                                    {#each data2["actresses"] as one}
                                        <div>
                                            <Link to="/actrice/{one.id}" class="onelink">
                                                <img src={one.photourl} alt="">
                                                <div class="text-center">{one.name}</div>
                                            </Link>
                                        </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}
                        {#if section == 2}
                            <section id="s2">
                                <div class="wrap">
                                    {#each data2["photos"] as one}
                                        <div>
                                            <Link to="/photo/{one.id}" class="onelink">
                                                <img src={one.photourl} alt="">
                                                <div class="text-center">{one.name}</div>
                                            </Link>
                                        </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}
                        {#if section == 3}
                            <section id="s3">
                                <div class="wrap">
                                    {#each data2["videos"] as one}
                                        <div>
                                            <Link to="/video/{one.id}" class="onelink">
                                                <img src={one.photourl} alt="">
                                                <div class="text-center">{one.name}</div>
                                            </Link>
                                        </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #search .container{
        background-color: transparent;
    }
    #search #results_wrap{
        background-color: white;
        display:flex;
    }
    #search #results_wrap #titles{
        height:calc(100vh - 140px);
    }
    #search #results_wrap #titles .onetitle{
        width:80px;
        padding:10px;
        background-color: gainsboro;
        color:white;
        cursor: pointer;
        transition: .5s;
    }
    #search #results_wrap #titles .onetitle.active{
        color:#f8b0c8;
        background-color: white;
    }
    #search #results_wrap #allsections{
        width:calc(100% - 80px);
    }
    #search #results_wrap section{
        padding:10px;
        height:calc(100vh - 140px);
        overflow-y:auto;
        width:100%;
    }
    #search :global(.onelink){
        color:black;
        text-decoration: none;
    }
    #search section#s1 .wrap{
        column-count: 3;
        column-gap: 2px;
    }
    #search section#s1 .wrap>div{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        padding:5px;
    }
    #search section#s2 .wrap{
        column-count: 4;
        column-gap: 2px;
    }
    #search section#s2 .wrap>div{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        padding:5px;
    }
    #search section#s3 .wrap{
        column-count: 3;
        column-gap: 2px;
    }
    #search section#s3 .wrap>div{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        padding:5px;
    }
    @media(max-width:767px){
		#search section#s1 .wrap{
            column-count: 2;
        }
        #search section#s2 .wrap{
            column-count: 2;
        }
        #search section#s3 .wrap{
            column-count: 2;
        }
    }
</style>