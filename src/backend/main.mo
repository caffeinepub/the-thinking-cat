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

  // Add sample seed data
  let sampleBlogPost1 : BlogPost = {
    title = "Top 21 Affiliate Marketing Programs 2024";
    content = "Discover the best affiliate marketing programs for 2024 and start earning passive income online.";
    excerpt = "Explore the best affiliate marketing programs for 2024.";
    category = "Affiliate Marketing";
    author = "Jane Doe";
    timestamp = 1_710_250_241_503_010;
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
