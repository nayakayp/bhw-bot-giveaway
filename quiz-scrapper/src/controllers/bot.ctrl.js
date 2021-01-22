const googleIt = require("google-it");
const got = require("got");
const metascraper = require("metascraper")([
  require("metascraper-title")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
]);
const keyword_extractor = require("keyword-extractor");
const { default: fetch } = require("node-fetch");

exports.home_view = (req, res) => {
  res.render("home.views.ejs", { metadatas: undefined });
};

exports.get_data = async (req, res) => {
  console.log(req.body);
  let keyword = "Money Heist Quiz";
  let limitPost = 20;

  const linkList = await googleIt({
    query: keyword,
    limit: limitPost,
  }).then((result) => {
    return result.map((list) => list.link);
  });

  const metadatas = async () => {
    return Promise.all(
      linkList.map(async (link) => {
        const { body: html, url } = await got(link);
        const metadata = await metascraper({ html, url }).catch((err) => {
          console.log("ada error");
        });
        let sentence = metadata.description;
        let extraction_result = keyword_extractor.extract(sentence, {
          language: "english",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: true,
        });
        metadata.keyword = extraction_result;

        // Get Pictures
        let indexQuery = Math.floor(
          Math.random() * Math.floor(metadata.keyword.length)
        );

        const response = await fetch(
          `https://pixabay.com/api/?key=14403966-1537cc64e9c06f1a7043c6c7b&q=${encodeURIComponent(
            metadata.keyword[indexQuery]
          )}&image_type=photo&pretty=true&per_page=3`
        )
          .then((result) => {
            return result;
          })
          .catch((err) => {
            console.log("ada error");
          });
        const images = await response.json();
        metadata.images = images.hits;
      })
    );
  };

  // const metadatas = linkList.map(async (link) => {
  //   const { body: html, url } = await got(link);
  //   const metadata = await metascraper({ html, url }).catch((err) => {
  //     console.log("ada error");
  //   });
  //   let sentence = metadata.description;
  //   let extraction_result = keyword_extractor.extract(sentence, {
  //     language: "english",
  //     remove_digits: true,
  //     return_changed_case: true,
  //     remove_duplicates: true,
  //   });
  //   metadata.keyword = extraction_result;

  //   // Get Pictures
  //   let indexQuery = Math.floor(
  //     Math.random() * Math.floor(metadata.keyword.length)
  //   );

  //   const response = await fetch(
  //     `https://pixabay.com/api/?key=14403966-1537cc64e9c06f1a7043c6c7b&q=${encodeURIComponent(
  //       metadata.keyword[indexQuery]
  //     )}&image_type=photo&pretty=true&per_page=3`
  //   )
  //     .then((result) => {
  //       return result;
  //     })
  //     .catch((err) => {
  //       console.log("ada error");
  //     });
  //   const images = await response.json();
  //   metadata.images = images.hits;

  //   return metadata;
  // });

  Promise.all(metadatas).then((values) => {
    console.log(values);
    res.render("home.views.ejs", { metadatas: values });
  });
};
