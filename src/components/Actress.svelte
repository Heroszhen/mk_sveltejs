<script>
    import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { ChevronLeft, ChevronRight } from "svelte-bootstrap-icons";
    import { onDestroy } from 'svelte';

    PageStore.set("actress");
    export let id;
    let actress = null;
    let index = 0;
    const unsubscribe = DataStore.subscribe(value => {
		for(let entry of value["actresses"]){
            if(entry["id"] == id){
                actress = entry;
                break;
            }
        }
	});
    onDestroy(unsubscribe);

    function changeIndex(action=-1){
        if(action == 1)index++;
        if(action == 2)index--;
        if(index >= actress["mkphotos"].length)index = 0;
        if(index < 0)index = actress["mkphotos"].length - 1;
    }
	
</script>

<div id="actress">
    {#if actress != null}
    <div class="container container2">
        <div class="row">
            <div class="col-md-8 order-2 order-md-1">
                <div class="container-fluid bg-white pt-2 pb-2">
                    {#if actress['mkphotos'].length != 0}
                    <div class="row">
                        <div class="col-12">
                            <h3 class="text-center">{actress.name}</h3>
                        </div>
                        <div class="col-6">
                            <span class="pointer" on:click="{()=>changeIndex(2)}">
                                <ChevronLeft />
                                Précédent
                            </span>
                        </div>
                        <div class="col-6 text-end">
                            <span class="pointer" on:click="{()=>changeIndex(1)}">
                                Suivant
                                <ChevronRight />
                            </span>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="pe-4 ps-4">
                                <img src="{actress['mkphotos'][index].photourl}" alt="" class="pointer" on:click="{()=>changeIndex(1)}">
                            </div>
                        </div>
                    </div>
                    {/if}
                </div>
            </div>
            <div class="col-md-4 order-1 order-md-2 mb-2">
                <div class="container-fluid bg-white pt-2 pb-2">
                   <img src="{actress.photourl}" alt="">
                   <div class="pt-2">
                        <div>
                            <span class="fw-bold">Née</span>: {new Intl.DateTimeFormat('fr-FR').format(new Date(actress.birthday))}
                        </div>
                        <div class="pb-3">
                            <span class="fw-bold">Pays</span>: {actress.country}
                        </div>
                        {@html actress.description}
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
	
</style>