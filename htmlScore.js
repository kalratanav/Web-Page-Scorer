const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash')
const { get } = require('cheerio/lib/api/traversing');
const { IgnorePlugin } = require('webpack');

let articles = []
let pathArr = []
let count = 0
let pageArr = []

async function gettingToPhilosophy(url)
{
  let links = []
  let res = await axios.get(url)
       const $ = cheerio.load(res.data)
       $('p').each((index, element) => {
           let check = false
           let link = $(element).find('a').map((i, x) => $(x)).toArray()
           let para = $(element).toString()
           for(let i = 0; i<link.length; i++){
                 let l = link[i]
                 let href = l.attr('href')
                 let str = l.toString()
                 let p = isParenthesized(para, "(", ")", para.indexOf(str), para.indexOf(str)+str.length)
                 let parent = l.parent()
                 if(parent && parent.attr('name') != 'i' && l != undefined && href && href.includes("/wiki/") && !href.includes("Help:IPA") && !p){
                    links.push(href)
                    check = true
                    return false;
              }
           }
           if(check){
              return false;
           }
   })

   let done = false
   let l = ""
     if(links[0]){
        l = links[0].substring(links[0].indexOf('/wiki/')+6)
     }
     if(articles.includes(l)){
        let index = articles.indexOf(l)
        pageArr.concat(pathArr[index])
        pathArr.push(pageArr)
        done = true
     }
     if(!done){
        if(links[0]=="/wiki/Philosophy"){
           pageArr.push(url.substring(url.indexOf('/wiki/')+6))
           pageArr.push("Philosophy")
           console.log(pageArr)
           articles.push(pageArr[0])
           pathArr.push(pageArr)
           //console.log(count)
           pageArr = []
           count = 0
        }
        else if(count > 156){
           articles.push(pageArr[0])
           pageArr.push('limit')
           pathArr.push(pageArr)
           pageArr = []
           count = 0
        }
        else if(pageArr.includes(l)){
           articles.push(pageArr[0])
           pageArr.push('loop')
           pathArr.push(pageArr)
           pageArr = []
           count = 0
         }
         else{
           let done = false
           if(articles.includes(l)){
              let index = articles.indexOf(l)
              pageArr.concat(pathArr[index])
              pathArr.push(pageArr)
              done = true
           }
           else{
              for(path in pathArr){
                 if(path.includes(l)){
                    let index = path.indexOf(l)
                    let arr = path.slice(index)
                    pageArr.push(arr)
                    pathArr.push(pageArr)
                    done = true
                    break
                 }
              }
           }
           if(!done){
              count++
              let temp = url.substring(url.indexOf('/wiki/')+6)
              pageArr.push(temp)
              await gettingToPhilosophy("https://en.wikipedia.org"+links[0])
           }
         }
     }  
}

async function randomArticle(){
  let url = ""
  let res = await axios.get("https://en.wikipedia.org/wiki/Special:Random")
  // .then(res=>{
     const $ = cheerio.load(res.data)
        $('link').each((index, element) => {
           let link = $(element).attr("rel")
           if(link == "canonical"){
              url = $(element).attr("href")
           //    console.log('random article: ' + url)
              return
        }
  })
  await gettingToPhilosophy(url)
}

async function randomArticleForOnlyOneArticle(){
   await randomArticle()
   console.log('1 starting random article^')
}

async function randomArticles(){
  for(let i = 0; i<25; i++){
     await randomArticle()
  }
  console.log('25 random articles^')
  compare()
}

function isParenthesized(para, delim1, delim2, first, last){
  let front = para.substring(0, first)
  let back = para.substring(last)
  let countFront1 = _.countBy(front)[delim1]
  let countFront2 = _.countBy(front)[delim2]
  let countBack1 = _.countBy(back)[delim1]
  let countBack2 = _.countBy(back)[delim2]
  return !(countFront1 == countFront2 && countBack1 == countBack2)
}

function compare(){
  let max = 0
  let index = -1
  for(let i = 0; i<pathArr.length; i++){
     if(pathArr[i].length > max){
        max = pathArr[i].length
        index = i
     }
  }
  let name = pathArr[index][0]
  console.log('The longest path to philosophy is '+pathArr[index].length+' clicks from the starting page: '+name);
}

randomArticleForOnlyOneArticle()
randomArticles()

const { IgnorePlugin } = require('webpack');

function scoreHTML(strHTML, keyword)
{
 let count = 0
 // paragrpah score
 var arrayOfParagraphs = ($(strHTML).filter('p').text()).split(" ")
 for(var i = 0; i < arrayOfParagraphs.length; i++)
 {
     if(keyword.toLowerCase()  == (arrayOfParagraphs[i].substring(0,keyword.length)).toLowerCase())
     {
       count += 1
     }
 }
// link score


var arrayOfLinks = ($(strHTML).filter('a').text()).split(" ")


for(var i = 0; i < arrayOfLinks.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfLinks[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 2


   }


}







// bold score (b)


var arrayOfBoldB = ($(strHTML).filter('b').text()).split(" ")


for(var i = 0; i < arrayOfBoldB.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfBoldB[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 2


   }


}







// bold score (strong)


var arrayOfBoldStrong = ($(strHTML).filter('strong').text()).split(" ")


for(var i = 0; i < arrayOfBoldStrong.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfBoldStrong[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 2


   }


}







// italic score (i)


var arrayOfItalicI = ($(strHTML).filter('i').text()).split(" ")


for(var i = 0; i < arrayOfItalicI.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfItalicI[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 2


   }


}







// italic score (em)


var arrayOfItalicEm = ($(strHTML).filter('em').text()).split(" ")


for(var i = 0; i < arrayOfItalicEm.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfItalicEm[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 2


   }


}







// h3 score


var arrayOfH3= ($(strHTML).filter('h3').text()).split(" ")


for(var i = 0; i < arrayOfH3.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfH3[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 3


   }


}







// h4 score


var arrayOfH4= ($(strHTML).filter('h4').text()).split(" ")


for(var i = 0; i < arrayOfH4.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfH4[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 3


   }


}







// h5 score


var arrayOfH5= ($(strHTML).filter('h5').text()).split(" ")


for(var i = 0; i < arrayOfH5.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfH5[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 3


   }


}







// h2 score


var arrayOfH2= ($(strHTML).filter('h2').text()).split(" ")


for(var i = 0; i < arrayOfH2.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfH2[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 4


   }


}







// h1 score


var arrayOfH1= ($(strHTML).filter('h1').text()).split(" ")


for(var i = 0; i < arrayOfH1.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfH1[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 5


   }


}







// title score


var arrayOfTitle= ($(strHTML).filter('title').text()).split(" ")


for(var i = 0; i < arrayOfTitle.length; i++)


{


   if(keyword.toLowerCase()  == (arrayOfTitle[i].substring(0,keyword.length)).toLowerCase() )


   {


     count += 10


   }


}


console.log(count)


}



























async function scoreRemote(urlName, keyword){


 let res = await axios.get(urlName)


 let count = 0


   const $ = cheerio.load(res.data)


// paragrpah score


   var arrayOfParagraphs = ($('p').text()).split(" ")


   for(var i = 0; i < arrayOfParagraphs.length; i++)


   {


       if(keyword.toLowerCase()  == arrayOfParagraphs[i].substring(0,keyword.length).toLowerCase())


       {


         count += 1


       }


   }







// link score


var arrayOfLinks = ($('a').text()).split(" ")


for(var i = 0; i < arrayOfLinks.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfLinks[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 2


   }


}







// bold score (b)


var arrayOfBoldB = ($('b').text()).split(" ")


for(var i = 0; i < arrayOfBoldB.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfBoldB[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 2


   }


}







// bold score (strong)


var arrayOfBoldStrong = ($('strong').text()).split(" ")


for(var i = 0; i < arrayOfBoldStrong.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfBoldStrong[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 2


   }


}







// italic score (i)


var arrayOfItalicI = ($('i').text()).split(" ")


for(var i = 0; i < arrayOfItalicI.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfItalicI[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 2


   }


}







// italic score (em)


var arrayOfItalicEm = ($('em').text()).split(" ")


for(var i = 0; i < arrayOfItalicEm.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfItalicEm[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 2


   }


}







// h3 score


var arrayOfH3= ($('h3').text()).split(" ")


for(var i = 0; i < arrayOfH3.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfH3[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 3


   }


}







// h4 score


var arrayOfH4= ($('h4').text()).split(" ")


for(var i = 0; i < arrayOfH4.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfH4[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 3


   }


}







// h5 score


var arrayOfH5= ($('h3').text()).split(" ")


for(var i = 0; i < arrayOfH5.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfH5[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 3


   }


}







// h2 score


var arrayOfH2= ($('h2').text()).split(" ")


for(var i = 0; i < arrayOfH2.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfH2[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 4


   }


}







// h1 score


var arrayOfH1= ($('h1').text()).split(" ")


for(var i = 0; i < arrayOfH1.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfH1[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 5


   }


}







// title score


var arrayOfTitle= ($('title').text()).split(" ")


for(var i = 0; i < arrayOfTitle.length; i++)


{


   if(keyword.toLowerCase()  == arrayOfTitle[i].substring(0,keyword.length).toLowerCase() )


   {


     count += 10


   }


}


console.log(count)


}


// scoreRemote('https://esultants.com/blog/2011/07/29/website-or-web-site', 'website')







scoreHTML('<!DOCTYPE html><html><head><title>All about chickens</title></head><body><h1>Something about chickens</h1><p>This is a story about a specific chicken named Ralph.</p><h3>Ralph the chicken</h3><p>yada, yada, yada</p></body></html>', 'chicken')


