<script>
    import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { ChevronLeft, ChevronRight } from "svelte-bootstrap-icons";
    import { onDestroy } from 'svelte';

    PageStore.set("actress");
    export let id;
    let actress = null;
    let photoindex = 0;
    let photos_wrap;
    const unsubscribe = DataStore.subscribe(value => {
		for(let entry of value["actresses"]){
            if(entry["id"] == id){
                actress = entry;
                break;
            }
        }
	});
    onDestroy(unsubscribe);

    function changeIndex(action,index=null){
        if(action == null){
            photoindex = index;
        }else{
            if(action == 1)photoindex++;
            if(action == 2)photoindex--;
            if(photoindex >= actress["mkphotos"].length)photoindex = 0;
            if(photoindex < 0)photoindex = actress["mkphotos"].length - 1;
            window.scrollTo(photos_wrap.scrollLeft,0);
        } 
    }
	
    //1:left; 2:right
    function scrollCarousel(way){
        let step = 73;
        if(way == 1){
            step = photos_wrap.scrollLeft - step;
            if(step < 0)step = 0;
        }
        if(way == 2){
            let max = photos_wrap.scrollWidth - photos_wrap.clientWidth;
            step = photos_wrap.scrollLeft + step;
            if(step > max)step = max;
        }console.log(step)
        photos_wrap.scrollTo(step, photos_wrap.scrollTop);
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
                            <span class="pointer arrow" on:click="{()=>changeIndex(1)}">
                                <ChevronLeft />
                                Précédent
                            </span>
                        </div>
                        <div class="col-6 text-end">
                            <span class="pointer arrow" on:click="{()=>changeIndex(2)}">
                                Suivant
                                <ChevronRight />
                            </span>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="pe-4 ps-4">
                                <img src="{actress['mkphotos'][photoindex].photourl}" alt="" class="pointer" on:click="{()=>changeIndex(1)}">
                            </div>
                        </div>
                        {#if actress['mkphotos'].length > 1}
                        <div class="col-12 mt-4">
                            <div class="zcarousel">
                                <div class="btn_arrow" on:click="{()=>scrollCarousel(1)}"><ChevronLeft /></div>
                                <div class="photos_wrap" bind:this={photos_wrap}>
                                    <div class="palette">
                                        {#each actress["mkphotos"] as one,index(index)}
                                        <div class="onephoto" class:active={photoindex==index} on:click="{()=>changeIndex(null,index)}">
                                            <img src="{one.photourl}" alt="">
                                        </div>
                                        {/each}
                                    </div>
                                </div>
                                <div class="btn_arrow" on:click="{()=>scrollCarousel(2)}"><ChevronRight /></div>
                            </div>
                        </div>
                        {/if}
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
	.arrow{
        padding:5px;
    }
    .arrow:hover{
        background-color: #f8b0c8;
        color:white;
        border-radius: 2px;
    }

    .zcarousel{
        width:100%;
        display:flex;
    }
    .zcarousel .btn_arrow{
        width:30px;
        display:flex;
        justify-content: center;
        align-items: center;
        background-color:#f8b0c8;
        color:white;
        cursor: pointer;
        height:120px;
    }
    .zcarousel .photos_wrap{
        width:calc(100% - 60px);
        display:flex;
        align-items: center;
        overflow: hidden;
    }
    .zcarousel .photos_wrap .palette{
        /* width:9999px; */
        display:flex;
        align-items: center;
    }
    .zcarousel .photos_wrap .onephoto{
        width:70px;
        height:80px;
        display:flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border:3px solid transparent;
        cursor: pointer;
    }
    .zcarousel .photos_wrap .onephoto.active{
        border-color:#FF88af;
    }
    .zcarousel .photos_wrap .onephoto img{
        width:100%;
        height:auto;
    }
</style>