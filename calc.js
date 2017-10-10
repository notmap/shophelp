


var getCardData = function(arrRaw, mode) {  
    mode !== 'calc' && (mode = 'show');
    var mark = ['d', 'a', 'b', 'c'], showData;
    showData = arrRaw.map((item) => {
        var value = Math.ceil( (item + 1) / 4);
        return {
            value: mode == 'show' ? value : (value > 10 ? 10 : value),
            mark: mark[(item + 1) % 4]
        }
    });
    showData = showData.map((item) => item.value); // show detail or not 
    return showData;
};

var getBasicInfo = function(arrShow) {  
    var five = 0, ten = 0, hua = 0, total = 0;
    arrShow.forEach((item) => {
        item == 10 && ten ++;
        item > 10 && hua ++;
        item <= 5 && five ++;
        total += item > 10 ? 10 : item;
        return item;
    });
    return {
        five: five,
        ten: ten,
        hua: hua,
        total: total
    };
};

var getTypeInfo = function(arrShow) {  
    var arrShowSort = arrShow.map((item) => item).sort((a, b) => a - b), typeArr = [];
    for (let i = 0; i < arrShowSort.length;) {
        var lastSameIndex = arrShowSort.lastIndexOf(arrShowSort[i]);
        typeArr.push({
            key: arrShowSort[i],
            num: lastSameIndex - i + 1
        });
        i = lastSameIndex + 1;
    }
    // typeArr = typeArr.map((item) => item.num); // show detail or not 
    return typeArr;
};

var getNiuInfo = function(arrCalc) {  
    for (var indexA = 0; indexA < arrCalc.length; indexA++) {
        for (var indexB = indexA + 1; indexB < arrCalc.length; indexB++) {
            for (var indexC = indexB + 1; indexC < arrCalc.length; indexC++) {
                var total = arrCalc[indexA] + arrCalc[indexB] + arrCalc[indexC];
                if (total % 10 == 0) {
                    return [indexA, indexB, indexC];
                }
            }
        }
    }
};

var sortCard = function(raw, sortArr, reverse) {
    var newRaw = raw.map((item) => item);
    var insertIndex = reverse ? raw.length - 1 : 0;
    sortArr.map((item) => {
        var insert = newRaw[item];
        newRaw.splice(item, 1);
        newRaw.splice(insertIndex, 0, insert);
    });
    return newRaw;
};

var getCardType = function(cardRaw) {

    var cardShow = getCardData(cardRaw, 'show'),
        cardCalc = getCardData(cardRaw, 'calc'),
        cardBasic = getBasicInfo(cardShow),
        cardType = getTypeInfo(cardShow),
        cardNiu = getNiuInfo(cardCalc),
        type,
        cardSorted;

    // console.log('cardShow', cardShow);
    // console.log('cardCalc', cardCalc);
    // console.log('cardBasic', cardBasic);
    // console.log('cardType', cardType);
    // console.log('cardNiu', cardNiu);

    if(!type && cardBasic.five == 5 && cardBasic.total < 10) {
        cardSorted = cardRaw.map((item) => item).sort((a, b) => a - b);
        type = 13;
    }                                                                                       
    if(!type && Math.max.apply(null, cardType.map((item) => item.num)) == 4) {
        var target;
        cardType.map((item) => {
            item.num == 1 && (target = cardShow.indexOf(item.key));
        })
        cardSorted = sortCard(cardRaw, [target], true);
        type = 12;
    }                                                 
    // if(!type && cardBasic.hua == 5) type = 11;                                                                      
    // if(!type && Math.max.apply(null, cardType) == 3 && Math.min.apply(null, cardType) == 2) type = undefined;     
    // if(!type && cardNiu && cardBasic.total % 10 == 0) type = 10;                                                
    // if(!type && cardNiu && cardBasic.total % 10 == 9) type = 9;                                                  
    // if(!type && cardNiu && cardBasic.total % 10 == 8) type = 8;                                                 
    // if(!type && cardNiu && cardBasic.total % 10 == 7) type = 7;                                                  
    // if(!type && cardNiu) type = cardBasic.total % 10;                                                           
    // if(!type && !cardNiu) type = 0;                                                                             
    return {
        type: type
        ,cardShow: cardShow
        ,cardSorted: cardSorted
    };
}; 












var test = [
    [37, 29, 45, 51, 2],
    [1, 14, 45, 51, 2],
    [37, 21, 2, 48, 8],
    [16, 28, 28, 51, 2],
    [37, 6, 45, 3, 2],
    [14, 4, 24, 51, 2],
    [20, 6, 45, 23, 4],
    [37, 31, 5, 51, 9],
    [41, 46, 47, 50, 51],
    [15, 12, 25, 14, 13],
    [0, 1, 4, 3, 7]
];

test.forEach((item) => {
    console.log(getCardType(item));
    console.log();
});



var a = [37, 29, 45, 51, 2];
var b = [37, 45, 2, 51, 29];


console.log(a.map((item, index, arr) => b.indexOf(item)));

function() {
    
}


