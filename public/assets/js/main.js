// $(document).ready(function () {
//   "use strict";

//   function initializePage() {
//     const ctx = $("#acquisitions");

//     if (ctx.length) {
//       new Chart(ctx, {
//         type: "bar",
//         data: {
//           labels: ["Jan - Mar", "Apr - June", "Jul - Sep", "Oct - Dec"],
//           datasets: [
//             {
//               label: "Total sales",
//               data: [12, 19, 3, 4],
//               borderWidth: 2,
//             },
//             {
//               label: "Total number of bills",
//               data: [5, 2, 3, 5],
//               borderWidth: 2,
//             },
//             {
//               label: "Products sold",
//               data: [19, 2, 3, 8],
//               borderWidth: 2,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             y: {
//               beginAtZero: true,
//             },
//           },
//           plugins: {
//             legend: {
//               position: "bottom",
//               labels: {
//                 padding: 30,
//               },
//             },
//           },
//         },
//       });
//     }

//     ///Menu
//     const menuItems = $(".menu__item");
//     menuItems.each(function () {
//       const menuItemMain = $(this).find(".menu__item-icon");
//       menuItemMain.on("click", function () {
//         const currentItem = $(this).parent();
//         const isActive = currentItem.hasClass("active");
//         menuItems.removeClass("active");
//         if (!isActive) {
//           currentItem.addClass("active");
//         }
//       });
//     });
//   }

//   // Initial page load
//   initializePage();

//   // Handle popstate event (back/forward navigation)
//   $(window).on("popstate unload", function () {
//     initializePage();
//   });
// });
