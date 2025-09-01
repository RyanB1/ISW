const stateIdentifiers = {
    "Andhra Pradesh": 1,
    "Arunachal Pradesh": 2,
    "Assam": 3,
    "Bihar": 4,
    "Chhattisgarh": 5,
    "Goa": 6,
    "Gujarat": 7,
    "Haryana": 8,
    "Himachal Pradesh": 9,
    "Jharkhand": 10,
    "Karnataka": 11,
    "Kerala": 12,
    "Madhya Pradesh": 13,
    "Maharashtra": 14,
    "Manipur": 15,
    "Meghalaya": 16,
    "Mizoram": 17,
    "Nagaland": 18,
    "Odisha": 19,
    "Punjab": 20,
    "Rajasthan": 21,
    "Sikkim": 22,
    "Tamil Nadu": 23,
    "Telangana": 24,
    "Tripura": 25,
    "Uttar Pradesh": 26,
    "Uttarakhand": 27,
    "West Bengal": 28
};

const stateCoords = {
    1: { lat: 15.91, lon: 79.74 },
    2: { lat: 27.10, lon: 93.61 },
    3: { lat: 26.20, lon: 92.93 },
    4: { lat: 25.96, lon: 85.14 },
    5: { lat: 21.28, lon: 81.87 },
    6: { lat: 15.30, lon: 74.12 },
    7: { lat: 22.25, lon: 71.19 },
    8: { lat: 29.06, lon: 76.08 },
    9: { lat: 31.10, lon: 77.16 },
    10: { lat: 23.61, lon: 85.27 },
    11: { lat: 15.31, lon: 75.71 },
    12: { lat: 10.85, lon: 76.27 },
    13: { lat: 23.53, lon: 77.80 },
    14: { lat: 19.75, lon: 75.71 },
    15: { lat: 24.66, lon: 93.90 },
    16: { lat: 25.57, lon: 91.88 },
    17: { lat: 23.16, lon: 92.93 },
    18: { lat: 26.16, lon: 94.56 },
    19: { lat: 20.95, lon: 85.09 },
    20: { lat: 31.14, lon: 75.34 },
    21: { lat: 27.02, lon: 74.21 },
    22: { lat: 27.53, lon: 88.51 },
    23: { lat: 11.12, lon: 78.65 },
    24: { lat: 17.12, lon: 79.53 },
    25: { lat: 23.94, lon: 91.98 },
    26: { lat: 26.84, lon: 80.94 },
    27: { lat: 30.07, lon: 79.09 },
    28: { lat: 22.98, lon: 87.86 }
};

const stateImages = {
    1: "Images/andhra-pradesh-outline-map.jpg",
    2: "Images/arunachal-pradesh-outline-map.jpg",
    3: "Images/assam-outline-map.jpg",
    4: "Images/bihar-outline-map.jpg",
    5: "Images/chhattisgarh-outline-map.jpg",
    6: "Images/goa-outline-map.jpg",
    7: "Images/gujarat-outline-map.jpg",
    8: "Images/haryana-outline-map.jpg",
    9: "Images/himachal-pradesh-outline-map.jpg",
    10: "Images/jharkhand-outline-map.jpg",
    11: "Images/karnataka-outline-map.jpg",
    12: "Images/kerala-outline-map.jpg",
    13: "Images/madhya-pradesh-outline-map.jpg",
    14: "Images/maharashtra-outline-map.jpg",
    15: "Images/manipur-outline-map.jpg",
    16: "Images/meghalaya-outline-map.jpg",
    17: "Images/mizoram-outline-map.jpg",
    18: "Images/nagaland-outline-map.jpg",
    19: "Images/odisha-outline-map.jpg",
    20: "Images/punjab-outline-map.jpg",
    21: "Images/rajasthan-outline-map.jpg",
    22: "Images/sikkim-outline-map.jpg",
    23: "Images/tamil-nadu-outline-map.jpg",
    24: "Images/telangana-outline-map.jpg",
    25: "Images/tripura-outline-map.jpg",
    26: "Images/uttar-pradesh-outline-map.jpg",
    27: "Images/uttarakhand-outline-map.jpg",
    28: "Images/west-bengal-outline-map.jpg"
};

const stateGuesses = [];

let guessCount = 1;

$(document).ready(function () {
    $("#StateSelectPicker").empty();
    $("#StateSelectPicker").append("<option value=''>Select a State</option>");
    for (const [key, value] of Object.entries(stateIdentifiers)) {
        let option = document.createElement("option");
        option.value = value;
        option.textContent = key;
        $("#StateSelectPicker").append(option);
    }

    $(".selectpicker").selectpicker("destroy").selectpicker();
    $(".dropdown-toggle").addClass("btn-dark").removeClass("btn-light").css("border-color", "#495057");
    $(".selectpicker").selectpicker("refresh");

    let i = 0;
    let shuffledStates = Object.entries(stateIdentifiers).map(([key, value]) => ({ key, value })).sort(() => Math.random() - 0.5);
    shuffledStates.forEach(({ key, value }) => {
        $(".carousel-inner").append(`<div class="carousel-item" data-id="${value}"><img src="${stateImages[value]}"></div>`);
        $(".carousel-indicators").append(`<button type="button" class="CarouselSlide" data-id="${value}" data-bs-target="#StateCarousel" data-bs-slide-to="${i}" aria-current="true" aria-label="Slide ${i + 1}"></button>`);
        i++;
    });

    $(".carousel-item:first").addClass("active");
    $(".carousel-indicators button:first").addClass("active");

    $(".carousel-control-prev, .carousel-control-next, .CarouselSlide").off("click").on("click", function () {
        ResetStateDropdown();
    });

    $("#StateCarousel").on("slide.bs.carousel", function (e) {
        const nextSlideId = $(e.relatedTarget).closest(".carousel-item").data("id");
        PopulatePastGuesses(nextSlideId);

        const prevSlideId = $(".carousel-item.active").data("id");
        let obj = stateGuesses.find(x => x.key === prevSlideId);
        if (obj) {
            const hasCorrect = obj.values.some(x => x.correct === true);
            if (obj.values.length < 6 && !hasCorrect) {
                $(".CarouselSlide[data-id='" + prevSlideId + "']").css("background-color", "#6196dc");
            }
        }
    });

    $("#GuessState").off("click").on("click", function () {
        if ($("#StateSelectPicker").val() === "" || $("#StateSelectPicker").val() === null) {
            if ($("#alert-container .MissingState").length === 0) {
                AlertMessage("You must select a state!", "MissingState");
            }

            return;
        }

        const correct = parseInt($(".carousel-item.active").data("id"));
        const guess = parseInt($("#StateSelectPicker").val());

        let CanContinue = true;
        $(".list-group-item[data-guess]").each(function () {
            if (parseInt($(this).data("guess")) === guess) {
                if ($("#alert-container .DupState").length === 0) {
                    AlertMessage("You cannot guess the same state more than once!", "DupState", "alert-warning");
                }

                CanContinue = false;
                return false;
            }
        });

        if (!CanContinue) {
            return;
        }

        $(this).addClass("disabled");
        $(".carousel-control-prev, .carousel-control-next").addClass("disabled").attr("disabled", true);
        $(".carousel-indicators button").attr("disabled", true);

        GetDirectionHint(correct, guess);
    });

    $("#ResetGame").off("click").on("click", function () {
        ResetStateDropdown();
        stateGuesses.length = 0;
        $("#StateCarousel").carousel(0);
        EmptyGuesses();
        $(".CarouselSlide").css("background-color", "");
        $("#NumCorrect").fadeOut(300, function () {
            $(this).text(0).fadeIn(300);
        });
    });
});

function GetDirectionHint(correctState, guessedState) {
    if (!(correctState in stateCoords) || !(guessedState in stateCoords)) {
        if ($("#alert-container .InvalidState").length === 0) {
            AlertMessage("Invalid state name", "InvalidState");
        }

        return;
    }

    ResetStateDropdown();

    $(".CurrentItem").addClass("Guessed placeholder-glow").removeClass("list-group-item-light");
    $(".CurrentItem .list-group-item").addClass("placeholder");

    const guessedName = Object.keys(stateIdentifiers).find(key => stateIdentifiers[key] === guessedState);
    if (correctState === guessedState) {
        setTimeout(function () {
            $(".CurrentItem .NextGuess").remove();
            $(".CurrentItem").removeClass("placeholder-glow");
            $(".CurrentItem").append(`<li class="list-group-item list-group-item-success"><strong>${guessedName}</strong></li>`);
            $("ul.list-group").not(".Guessed").empty();

            let count = parseInt($("#NumCorrect").text());
            $("#NumCorrect").fadeOut(300, function () {
                $(this).text(++count).fadeIn(300);
            });

            let obj = stateGuesses.find(x => x.key === correctState);
            if (obj) {
                obj.values.push({
                    stateId: correctState,
                    stateName: guessedName,
                    distance: "",
                    direction: "",
                    correct: true
                });
            }
            else {
                stateGuesses.push({
                    key: correctState,
                    values: [{
                        stateId: correctState,
                        stateName: guessedName,
                        distance: "",
                        direction: "",
                        correct: true
                    }]
                });
            }

            confetti({
                particleCount: 500,
                spread: 180,
                origin: { y: 0.8 }
            });

            $(".carousel-control-prev, .carousel-control-next").removeClass("disabled").removeAttr("disabled");
            $(".carousel-indicators button").removeAttr("disabled");
            $(".CarouselSlide[data-id='" + correctState + "']").css("background-color", "#64d043");
        }, 1500);

        guessCount = 1;
        return;
    }

    const { lat: lat1, lon: lon1 } = stateCoords[guessedState];
    const { lat: lat2, lon: lon2 } = stateCoords[correctState];

    const distance = HaversineDistance(lat1, lon1, lat2, lon2);
    const direction = GetDirectionImage(GetDirection(lat1, lon1, lat2, lon2));

    setTimeout(function () {
        $(".CurrentItem .NextGuess").remove();
        $(".CurrentItem").append(`<li class="list-group-item" data-guess="${guessedState}"><strong>${guessedName}</strong></li>`);
        $(".CurrentItem").append(`<li class="list-group-item"><strong>${distance.toFixed(1)}km</strong></li>`);
        $(".CurrentItem").append(`<li class="list-group-item"><strong>${direction}</strong></li>`);

        let nextItem = $(".CurrentItem").eq(0).closest(".row").next(".row").find("ul.list-group").first();
        nextItem.addClass("list-group-item-light CurrentItem");
        $(".Guessed").removeClass("CurrentItem placeholder-glow");
        $(".CurrentItem .list-group-item").addClass("NextGuess").html(`<strong>Guess ${++guessCount} / 6</strong>`);

        let obj = stateGuesses.find(x => x.key === correctState);
        if (obj) {
            obj.values.push({
                stateId: guessedState,
                stateName: guessedName,
                distance: distance.toFixed(1) + "km",
                direction: direction,
                correct: false
            });
        }
        else {
            stateGuesses.push({
                key: correctState,
                values: [{
                    stateId: guessedState,
                    stateName: guessedName,
                    distance: distance.toFixed(1) + "km",
                    direction: direction,
                    correct: false
                }]
            });
        }

        if (guessCount > 6) {
            const correctName = Object.keys(stateIdentifiers).find(key => stateIdentifiers[key] === correctState);
            $("#CorrectAnswer").append(`<span class="badge p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle mb-4" style="font-size: medium;">
                    Correct State: ${correctName}
                </span>`);

            $(".CarouselSlide[data-id='" + correctState + "']").css("background-color", "#dc3545");
        }
        else {
            $("#GuessState").removeClass("disabled");
        }

        $(".carousel-control-prev, .carousel-control-next").removeClass("disabled").removeAttr("disabled");
        $(".carousel-indicators button").removeAttr("disabled");
    }, 1500);
}

function GetDirection(lat1, lon1, lat2, lon2) {
    let ns = "", ew = "";
    if (lat2 > lat1 + .1) {
        ns = "north";
    }
    else if (lat2 < lat1 - .1) {
        ns = "south";
    }

    if (lon2 > lon1 + .1) {
        ew = "east";
    }
    else if (lon2 < lon1 - .1) {
        ew = "west";
    }

    if (ns && ew) {
        return `${ns}${ew}`;
    }

    return ns || ew;
}

function HaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    let dLat = ToRadians(lat2 - lat1);
    let dLon = ToRadians(lon2 - lon1);
    let a = Math.sin(dLat / 2) ** 2 + Math.cos(ToRadians(lat1)) * Math.cos(ToRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function ToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function GetDirectionImage(direction) {
    let image = "";
    switch (direction) {
        case "north":
            image = "<i class='bi bi-arrow-up-square-fill' style='font-size: x-large;'></i>";
            break;
        case "east":
            image = "<i class='bi bi-arrow-right-square-fill' style='font-size: x-large;'></i>";
            break;
        case "south":
            image = "<i class='bi bi-arrow-down-square-fill' style='font-size: x-large;'></i>";
            break;
        case "west":
            image = "<i class='bi bi-arrow-left-square-fill' style='font-size: x-large;'></i>";
            break;
        case "northeast":
            image = "<i class='bi bi-arrow-up-right-square-fill' style='font-size: x-large;'></i>";
            break;
        case "northwest":
            image = "<i class='bi bi-arrow-up-left-square-fill' style='font-size: x-large;'></i>";
            break;
        case "southeast":
            image = "<i class='bi bi-arrow-down-right-square-fill' style='font-size: x-large;'></i>";
            break;
        case "southwest":
            image = "<i class='bi bi-arrow-down-left-square-fill' style='font-size: x-large;'></i>";
            break;
    }

    return image;
}

function ResetStateDropdown() {
    $("#StateSelectPicker").val("").selectpicker("destroy").selectpicker();
    $(".dropdown-toggle").addClass("btn-dark").removeClass("btn-light").css("border-color", "#495057");
}

function AlertMessage(message, uniqueClassName, alertColor = "alert-danger") {
    const alert = $(`<div class="alert ${alertColor} ${uniqueClassName} alert-dismissible fade show" role="alert">${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`);
    $("#alert-container").append(alert);

    setTimeout(function () {
        alert.alert("close");
    }, 3000);
}

function EmptyGuesses() {
    guessCount = 1;
    $("ul.list-group").each(function (i) {
        $(this).removeClass("list-group-item-light Guessed").empty();
        if (i === 0) {
            $(this).addClass("CurrentItem list-group-item-light");
            $(this).append("<li class='list-group-item NextGuess'><strong>Guess 1 / 6</strong></li>");
        }
        else {
            $(this).removeClass("CurrentItem");
            $(this).append("<li class='list-group-item'>&nbsp;</li>");
        }
    });

    $("#GuessState").removeClass("disabled");
    $("#CorrectAnswer").empty();
}

function PopulatePastGuesses(id) {
    let obj = stateGuesses.find(x => x.key === id);
    if (obj) {
        $("#CorrectAnswer").empty();
        guessCount = 1;
        let hasCorrect = false, hasNextGuess = false, totalRows = 0;
        $("ul.list-group").each(function (i) {
            $(this).removeClass("list-group-item-light CurrentItem").empty();
            if (i < obj.values.length) {
                $(this).addClass("Guessed");

                const value = obj.values[i];
                if (value.correct) {
                    $(this).append(`<li class="list-group-item list-group-item-success"><strong>${value.stateName}</strong></li>`);
                    hasCorrect = true;
                }
                else {
                    $(this).append(`<li class="list-group-item" data-guess="${value.stateId}"><strong>${value.stateName}</strong></li>`);
                    $(this).append(`<li class="list-group-item"><strong>${value.distance}</strong></li>`);
                    $(this).append(`<li class="list-group-item"><strong>${value.direction}</strong></li>`);
                    if (i + 1 === 6) {
                        const correctName = Object.keys(stateIdentifiers).find(key => stateIdentifiers[key] === id);
                        $("#CorrectAnswer").append(`<span class="badge p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle mb-4" style="font-size: medium;">
                            Correct State: ${correctName}
                        </span>`);
                    }
                }

                guessCount++;
            }
            else if (!hasCorrect) {
                $(this).removeClass("Guessed");
                if (!hasNextGuess) {
                    $(this).addClass("CurrentItem list-group-item-light");
                    $(this).append(`<li class="list-group-item NextGuess"><strong>Guess ${i + 1} / 6</strong></li>`);
                    hasNextGuess = true;
                }
                else {
                    $(this).removeClass("CurrentItem");
                    $(this).append("<li class='list-group-item'>&nbsp;</li>");
                }
            }

            totalRows++;
        });

        if (!hasCorrect) {
            for (let i = totalRows; i <= 6; i++) {
                if (!hasNextGuess) {
                    $("ul.list-group").eq(i).addClass("CurrentItem list-group-item-light");
                    $("ul.list-group").eq(i).append(`<li class="list-group-item NextGuess"><strong>Guess ${guessCount} / 6</strong></li>`);
                    hasNextGuess = true;
                }
                else {
                    $("ul.list-group").eq(i).append("<li class='list-group-item'>&nbsp;</li>");
                }
            }

            if ($("#CorrectAnswer span").length === 0) {
                $("#GuessState").removeClass("disabled");
            }
            else {
                $("#GuessState").addClass("disabled");
            }
        }
        else {
            $("#GuessState").addClass("disabled");
        }
    }
    else {
        EmptyGuesses();
    }
}