# TurtleROC

Interactive and Animated ROC Curve Visualizations in R

TurtleROC provides tools for visualizing, explaining, and exploring ROC curves interactively.

## Features
- Turtle Path ROC plots
	+ Animated "turtle path" ROC curve with points turning bright as the turtle passes.
	+ Confusion matrix showing TP, FP, FN, TN in real time.
	+ Pause/play toggle for animation control.
- Coming soon:
	+ Binormal ROC curves
	+ Gain curves
	+ Total Operating Characteristic (TOC) curves
	+ AUC explanations

## Installation
    install.packages('devtools')
    devtools::install('TurtleROC')

## Example Usage
    library(TurtleROC)
    df <- data.frame(score=c(0.9,0.85,0.8,0.7,0.6), actual=c(1,0,1,0,1))
    TurtlePathWidget(df)

## Shiny Example
    library(shiny)
    ui <- fluidPage(TurtlePathWidgetOutput('rocWidget', width='600px', height='600px'))
    server <- function(input, output, session) {
      output$rocWidget <- renderTurtlePathWidget({TurtlePathWidget(df)})
    }
    shinyApp(ui, server)

## License
MIT
