<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';
    import { getRandomNumber } from '../services/ToolService.js'

    import ModalPhoto from './ModalPhoto.svelte';

    PageStore.set("photos");
    let photourl = "";
    let allphotos = [];
    let timer = null;
    let order = 0;
    const unsubscribe = DataStore.subscribe(value => {
		allphotos = value["photos"];
	});
	onDestroy(()=>{
        unsubscribe;
        Diaporama(0);
    });

    function setPhotourl(url){
        photourl = url;
    }
    function closeModalphoto(){
        Diaporama(0);
    }
    //1:start,0:end
    function Diaporama(action){
        if(action == 0){
            window.clearInterval(timer);
            timer = null;
            photourl = "";
        }else{
            let index = 0;
            setPhotourl(allphotos[index]["photourl"]);
            timer = window.setInterval(()=>{
                index++;
                setPhotourl(allphotos[index]["photourl"]);
                if(index >= allphotos.length)index = 0;
            },1500);
        }
    }

    function orderPhotos(action){
        order = action;
        if(action == 1){
            let tab_index = [];
            let tab = [];//stock new photos
            let index;
            while(tab_index.length != allphotos.length){
                index = getRandomNumber(0,allphotos.length - 1);
                while(tab_index.includes(index))index = getRandomNumber(0,allphotos.length - 1);
                tab_index.push(index);
            }
            tab_index.forEach(index=>tab.push(allphotos[index]));
            allphotos = tab;
        }else{
            allphotos.sort((a,b)=>{
                if(action == 2)return a.name.localeCompare(b.name);
                else return b.name.localeCompare(a.name);
            });allphotos = allphotos;
        }
    }
</script>

<div id="photos">
    <div class="container pt-2">
        <div id="btns_wrap" class="d-flex align-items-center">
            <div>
                <button class="btn btn-sm btn-dark" on:click="{()=>Diaporama(1)}">Diaporama</button>
            </div>
            <div>
                <div class="dropdown">
                    <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {#if order == 0}
                            Ordonnées par
                        {:else if order == 1}
                            Arbitraire
                        {:else if order == 2}
                            Nom - croissant
                        {:else}
                            Nom - décroissant
                        {/if}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                          <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(1)}">Arbitraire</div>
                        </li>
                        <li>
                            <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(2)}">Nom - croissant</div>
                        </li>
                        <li>
                            <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(3)}">Nom - décroissant</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="wrap_photos">
        {#each allphotos as photo,index(index)}
            <div class="onephoto" on:click="{()=>setPhotourl(photo.photourl)}">
                <div>
                    <img src="{photo.photourl}" alt="">
                </div>
                <div class="name">{photo.name}</div>
            </div>
        {/each}
        </div>
    </div>
    {#if photourl != ""}
        <ModalPhoto photourl={photourl} on:message={closeModalphoto}  />
    {/if}
</div>

<style>
    /* https://www.pinterest.fr/search/pins/?rs=ac&len=2&q=food&eq=food&etslf=3228&term_meta[]=food%7Cautocomplete%7C0 */
	#wrap_photos{
        width:100%;
        column-count: 4;
        column-gap: 15px;
        cursor: pointer;
        padding-top:10px;
        padding-bottom:10px;
    }
    #wrap_photos .onephoto{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        position:relative;
    }
    #wrap_photos .onephoto img{
        border-radius: 16px;
    }
    #wrap_photos .onephoto .name{
        position: absolute;
        top:0;
        height:100%;
        width:100%;
        display:none;
    }
    #wrap_photos .onephoto:hover .name{
        display:block;
        background-color:rgba(255,255,255,.5);
        padding:5px;
    }

    #photos #btns_wrap>div{
        margin-right:20px
    }
    @media(max-width:767px){
        #wrap_photos{
            column-count: 3;
        }
    }
    @media(max-width:575px){
        #wrap_photos{
            column-count: 2;
        }
    }
</style>