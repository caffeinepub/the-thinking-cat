import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";

actor {
  type BlogPost = {
    title : Text;
    content : Text;
    excerpt : Text;
    category : Text;
    author : Text;
    timestamp : Time.Time;
    postId : Nat;
  };

  type AffiliateProduct = {
    name : Text;
    description : Text;
    url : Text;
    discount : Text;
    price : Text;
    productId : Nat;
  };

  type Feedback = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
    feedbackId : Nat;
  };

  module BlogPost {
    public func compare(blogPost1 : BlogPost, blogPost2 : BlogPost) : Order.Order {
      Nat.compare(blogPost1.postId, blogPost2.postId);
    };
  };

  module AffiliateProduct {
    public func compare(affiliateProduct1 : AffiliateProduct, affiliateProduct2 : AffiliateProduct) : Order.Order {
      Nat.compare(affiliateProduct1.productId, affiliateProduct2.productId);
    };
  };

  module Feedback {
    public func compare(feedback1 : Feedback, feedback2 : Feedback) : Order.Order {
      Nat.compare(feedback1.feedbackId, feedback2.feedbackId);
    };
  };

  let blogPosts = Map.empty<Nat, BlogPost>();
  let affiliateProducts = Map.empty<Nat, AffiliateProduct>();
  let feedbackEntries = Map.empty<Nat, Feedback>();
  var nextPostId = 1;
  var nextProductId = 1;
  var nextFeedbackId = 1;

  // Seed: HAPPINESS post under 2-Minute Thoughts
  let sampleBlogPost1 : BlogPost = {
    title = "HAPPINESS";
    content = "Just heard a bollywood song (Tumse Milke Dilka Hai Jo Haal Kya Kahe...) and my mind started further lyrics and within seconds i was humming the tune!\n\nHappiness is often imagined as something large such as an achievement, a milestone, a moment that stands out clearly in memory. But most of the time, it doesn't arrive like that. It shows up quietly. In small pauses between tasks. In a familiar song playing in the background. In the comfort of doing something without urgency. These moments rarely announce themselves, which is why they're easy to overlook.\n\nIn a way, happiness is less about intensity and more about frequency. Maybe that's why we often feel it in ordinary routines rather than extraordinary events.\n\nWe keep waiting for something significant to change how we feel, while smaller moments quietly pass by, doing the same work in a less noticeable way. Perhaps happiness isn't something we find. It's something we start noticing. Maybe that's why happiness is so underrated.\n\nAs Albus Dumbledore once said, \"Happiness can be found even in the darkest of times, if one only remembers to turn on the light.\"\n\n- The thinking cat";
    excerpt = "Happiness is often imagined as something large. But most of the time, it shows up quietly — in a familiar song, in a small pause between tasks.";
    category = "2-Minute Thoughts";
    author = "The Thinking Cat";
    timestamp = 1_742_900_000_000_000_000;
    postId = nextPostId;
  };
  blogPosts.add(nextPostId, sampleBlogPost1);
  nextPostId += 1;

  let sampleAffiliateProduct1 : AffiliateProduct = {
    name = "Web Hosting Deal";
    description = "Get 50% off premium web hosting with our exclusive affiliate offer.";
    url = "https://webhosting.example.com";
    discount = "50% Off";
    price = "$4.99/mo";
    productId = nextProductId;
  };
  affiliateProducts.add(nextProductId, sampleAffiliateProduct1);
  nextProductId += 1;

  public shared ({ caller }) func createBlogPost(title : Text, content : Text, excerpt : Text, category : Text, author : Text) : async Nat {
    let postId = nextPostId;
    let blogPost : BlogPost = {
      title;
      content;
      excerpt;
      category;
      author;
      timestamp = Time.now();
      postId;
    };
    blogPosts.add(postId, blogPost);
    nextPostId += 1;
    postId;
  };

  public query ({ caller }) func getBlogPost(postId : Nat) : async BlogPost {
    switch (blogPosts.get(postId)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort();
  };

  public shared ({ caller }) func addAffiliateProduct(name : Text, description : Text, url : Text, discount : Text, price : Text) : async Nat {
    let productId = nextProductId;
    let product : AffiliateProduct = {
      name;
      description;
      url;
      discount;
      price;
      productId;
    };
    affiliateProducts.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public query ({ caller }) func getAffiliateProduct(productId : Nat) : async AffiliateProduct {
    switch (affiliateProducts.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllAffiliateProducts() : async [AffiliateProduct] {
    affiliateProducts.values().toArray().sort();
  };

  public shared ({ caller }) func submitFeedback(name : Text, email : Text, message : Text) : async Nat {
    let feedbackId = nextFeedbackId;
    let newFeedback : Feedback = {
      name;
      email;
      message;
      timestamp = Time.now();
      feedbackId;
    };
    feedbackEntries.add(feedbackId, newFeedback);
    nextFeedbackId += 1;
    feedbackId;
  };

  public query ({ caller }) func getAllFeedbackEntries() : async [Feedback] {
    feedbackEntries.values().toArray().sort();
  };
};
