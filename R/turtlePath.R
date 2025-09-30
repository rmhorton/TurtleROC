library(htmlwidgets)

#' Turtle Path ROC Widget
#'
#' Create an interactive, animated Turtle Path ROC curve.
#'
#' @param data A data.frame with columns `score` (numeric) and `actual` (0/1).
#' @param width Width of the widget in pixels (default 600).
#' @param height Height of the widget in pixels (default 600).
#'
#' @return An htmlwidget displaying the Turtle Path ROC plot.
#' @import htmlwidgets
#' @export
TurtlePathWidget <- function(data, width = 600, height = 600) {
	x <- list(data = data)
	htmlwidgets::createWidget(
		name = 'turtlePath',
		x,
		width = width,
		height = height,
		package = 'TurtleROC'
	)
}

#' Shiny output function for Turtle Path ROC
#'
#' Use this function in a Shiny UI to create a placeholder for the Turtle Path widget.
#'
#' @param outputId Output variable to read from in Shiny.
#' @param width Width of the widget (default '100%').
#' @param height Height of the widget (default '600px').
#'
#' @return A Shiny output binding for the Turtle Path ROC widget.
#' @seealso \code{\link{renderTurtlePathWidget}}
#' @export
TurtlePathWidgetOutput <- function(outputId, width = '100%', height = '600px') {
	htmlwidgets::shinyWidgetOutput(outputId, 'turtlePath', width, height, package = 'TurtleROC')
}

#' Shiny render function for Turtle Path ROC
#'
#' Use this function in a Shiny server to render a Turtle Path widget.
#'
#' @param expr An expression that generates a TurtlePathWidget.
#' @param env The environment in which to evaluate expr (default: parent.frame()).
#' @param quoted Is expr a quoted expression? (default FALSE)
#'
#' @return A Shiny render function for the Turtle Path ROC widget.
#' @seealso \code{\link{TurtlePathWidgetOutput}}
#' @export
renderTurtlePathWidget <- function(expr, env = parent.frame(), quoted = FALSE) {
	if (!quoted) expr <- substitute(expr)
	htmlwidgets::shinyRenderWidget(expr, TurtlePathWidgetOutput, env, quoted = TRUE)
}
