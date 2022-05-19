import {connect} from "react-redux";

import {createStructuredSelector} from "reselect";

import {HomePage} from "./HomePage.jsx";
import {totalProductCount, publishedProductCount, unpublishedProductCount} from "../../store/productCount/selectors.js";
import {getTotalProductCount, getPublishedProductCount, getUnpublishedProductCount} from "../../store/productCount/actions.js";

const mapDispatchToProps = {
    getTotalProductCount,
    getPublishedProductCount,
    getUnpublishedProductCount,
}

const mapStateToProps = createStructuredSelector({
    totalProductCount,
    publishedProductCount,
    unpublishedProductCount,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);